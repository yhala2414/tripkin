import { useEffect, useMemo, useState } from 'react'
import { TextArea, Toast } from 'antd-mobile'
import {
  CalendarOutline,
  EditSOutline,
  FilterOutline,
  HeartFill,
  HeartOutline,
  LocationOutline,
  MessageOutline,
  StarFill,
  StarOutline,
  TagOutline,
} from 'antd-mobile-icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BaseBottomSheet from '@/components/BaseBottomSheet'
import EmptyState from '@/components/EmptyState'
import PageTopBar from '@/components/PageTopBar'
import {
  getDestinationResolveHint,
  resolveDestination,
} from '@/utils/destinationResolver'
import { getRegionById, getSpotById } from '@/pages/Map/data/mapData'
import { useTripStore } from '@/store/useTripStore'
import { useUserAssetStore } from '@/store/useUserAssetStore'
import { navigateBackOr } from '@/utils/navigation'
import {
  bottleTypeOptions,
  createBottleMessage,
  defaultBottleImage,
  getBottleListForDestination,
  type BottleMessage,
  type BottleServiceListResult,
  type BottleVisibilityType,
  typeLabels,
} from '@/services/bottleService'
import {
  toggleAuthorFollow,
  toggleBottleCollect,
  toggleBottleLike,
} from '@/services/userAssetService'
import styles from './Bottle.module.less'

const defaultDestinationId = 'sichuan-chuanxi'
const maxContentLength = 500

type SortBy = 'latest' | 'hottest'
type BottleFilter = 'all' | BottleMessage['type']
function HeartIcon({ filled = false }: { filled?: boolean }) {
  return filled ? (
    <HeartFill aria-hidden="true" data-filled={filled} />
  ) : (
    <HeartOutline aria-hidden="true" data-filled={filled} />
  )
}

function BookmarkIcon({ filled = false }: { filled?: boolean }) {
  return filled ? (
    <StarFill aria-hidden="true" data-filled={filled} />
  ) : (
    <StarOutline aria-hidden="true" data-filled={filled} />
  )
}

function BottleGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 3h6M10 3v4.1L6.6 14a4.8 4.8 0 0 0 4.3 7h2.2a4.8 4.8 0 0 0 4.3-7L14 7.1V3" />
      <path d="M8 15.5c1.2-.7 2.2-.7 3.4 0 1 .6 2.1.6 3.6-.2" />
    </svg>
  )
}

const filterOptions: Array<{ key: BottleFilter; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'memory', label: '回忆瓶' },
  { key: 'wish', label: '心愿瓶' },
  { key: 'guide', label: '攻略瓶' },
  { key: 'companion', label: '搭子瓶' },
]

function getDestinationDisplayName(destination: {
  id: string
  name: string
  parentId?: string
  parentName?: string
}) {
  const spot = getSpotById(destination.id)

  if (spot) {
    const region = getRegionById(spot.parentId)
    return region ? `${spot.name} · ${region.name}` : spot.name
  }

  const region = getRegionById(destination.id)

  if (region) {
    return region.name
  }

  return destination.parentName
    ? `${destination.name} · ${destination.parentName}`
    : destination.name
}

function getDestinationShortName(destination: { id: string; name: string }) {
  return getSpotById(destination.id)?.name ?? destination.name
}

function getSourceText(
  source: BottleServiceListResult['source'] | undefined,
  sourceName: string | undefined,
  destinationName: string,
) {
  if (source === 'parent' && sourceName) {
    return `当前目的地暂无专属瓶子，先展示 ${sourceName} 的同地区精选漂流瓶。`
  }

  if (source === 'fallback') {
    return `${destinationName} 暂无专属瓶子，已展示目的地默认灵感。`
  }

  return ''
}

function getQueryDestination(searchParams: URLSearchParams) {
  return (
    searchParams.get('spotId') ||
    searchParams.get('dest') ||
    searchParams.get('regionId') ||
    searchParams.get('spotName') ||
    searchParams.get('regionName')
  )
}

function sortBottles(items: BottleMessage[], sortBy: SortBy) {
  const nextItems = [...items]

  if (sortBy === 'hottest') {
    return nextItems.sort(
      (a, b) => b.likes + b.comments - (a.likes + a.comments),
    )
  }

  return nextItems.sort(
    (a, b) =>
      new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime(),
  )
}

function Bottle() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sessionDestination = useTripStore((state) => state.destination)
  const setDestination = useTripStore((state) => state.setDestination)
  const likedBottleIds = useUserAssetStore((state) => state.likedBottleIds)
  const savedBottleIds = useUserAssetStore((state) => state.savedBottleIds)
  const followedAuthorIds = useUserAssetStore(
    (state) => state.followedAuthorIds,
  )
  const action = searchParams.get('action')
  const queryDestination = getQueryDestination(searchParams)
  const currentDestination = useMemo(
    () =>
      resolveDestination({
        queryDest: queryDestination,
        sessionDest: sessionDestination,
        defaultId: defaultDestinationId,
      })!,
    [queryDestination, sessionDestination],
  )
  const [sortBy, setSortBy] = useState<SortBy>('latest')
  const [activeFilter, setActiveFilter] = useState<BottleFilter>('all')
  const [bottleRequest, setBottleRequest] = useState<{
    requestKey: string
    result: BottleServiceListResult | null
    error: string
  }>({
    requestKey: '',
    result: null,
    error: '',
  })
  const [selectedBottleId, setSelectedBottleId] = useState<string | null>(null)
  const [manualAddSheetOpen, setManualAddSheetOpen] = useState(false)
  const [dismissedAddKey, setDismissedAddKey] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [selectedBottleType, setSelectedBottleType] =
    useState<BottleVisibilityType>('normal')
  const [formError, setFormError] = useState('')
  const [refreshSeed, setRefreshSeed] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [imageUploadHint, setImageUploadHint] = useState('')

  const requestKey = `${currentDestination.id}:${refreshSeed}`
  const loading = bottleRequest.requestKey !== requestKey
  const bottleResult = loading ? null : bottleRequest.result
  const loadError = loading ? '' : bottleRequest.error

  useEffect(() => {
    setDestination(currentDestination.id)
  }, [currentDestination.id, setDestination])

  useEffect(() => {
    let cancelled = false

    getBottleListForDestination({
      destId: currentDestination.id,
      destName: currentDestination.name,
      parentId: currentDestination.parentId,
      parentName: currentDestination.parentName,
    })
      .then((result) => {
        if (cancelled) {
          return
        }

        setBottleRequest({
          requestKey,
          result,
          error: '',
        })
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return
        }

        setBottleRequest({
          requestKey,
          result: null,
          error:
            error instanceof Error
              ? error.message
              : '漂流瓶列表加载失败，请稍后重试。',
        })
      })

    return () => {
      cancelled = true
    }
  }, [
    currentDestination.id,
    currentDestination.name,
    currentDestination.parentId,
    currentDestination.parentName,
    requestKey,
  ])

  const baseBottles = useMemo(
    () => bottleResult?.items ?? [],
    [bottleResult?.items],
  )

  const bottles = useMemo(() => {
    const patchedBottles = baseBottles.map((bottle) => {
      const isLiked = likedBottleIds.includes(bottle.id) || bottle.isLiked
      const isCollected =
        savedBottleIds.includes(bottle.id) || bottle.isCollected
      const isFollowing =
        followedAuthorIds.includes(bottle.authorId) || bottle.isFollowing

      return {
        ...bottle,
        isLiked,
        isCollected,
        isFollowing,
        likes: isLiked && !bottle.isLiked ? bottle.likes + 1 : bottle.likes,
      }
    })
    const visibleBottles =
      activeFilter === 'all'
        ? patchedBottles
        : patchedBottles.filter((bottle) => bottle.type === activeFilter)

    return sortBottles(visibleBottles, sortBy)
  }, [
    activeFilter,
    baseBottles,
    followedAuthorIds,
    likedBottleIds,
    savedBottleIds,
    sortBy,
  ])

  const selectedBottle = bottles.find(
    (bottle) => bottle.id === selectedBottleId,
  )
  const sourceText = getSourceText(
    bottleResult?.source,
    bottleResult?.sourceName,
    currentDestination.name,
  )
  const destinationHint = getDestinationResolveHint(currentDestination)
  const addActionKey = `${currentDestination.id}:${action ?? ''}`
  const addSheetOpen =
    manualAddSheetOpen ||
    ((action === 'add' || action === 'throw') &&
      dismissedAddKey !== addActionKey)
  const bottleCount = currentDestination.bottleCount ?? bottles.length
  const formCount = messageText.length
  const destinationDisplayName = getDestinationDisplayName(currentDestination)
  const destinationShortName = getDestinationShortName(currentDestination)

  const showToast = (message: string) => {
    Toast.show({
      content: message,
      duration: 1800,
    })
  }

  const handleToggleLike = (bottleId: string) => {
    toggleBottleLike(bottleId)
  }

  const handleToggleCollect = (bottleId: string) => {
    const bottle = bottles.find((item) => item.id === bottleId)

    if (bottle) {
      toggleBottleCollect(bottle)
    }
  }

  const handleToggleFollow = (bottleId: string) => {
    const bottle = bottles.find((item) => item.id === bottleId)

    if (bottle) {
      toggleAuthorFollow(bottle.authorId)
    }
  }

  const handleImagePlaceholderClick = () => {
    setImageUploadHint('图片上传暂未接入，最多可上传 9 张。')
  }

  const handleOpenAddSheet = () => {
    setFormError('')
    setManualAddSheetOpen(true)
    setDismissedAddKey(null)
  }

  const handleCloseAddSheet = () => {
    setManualAddSheetOpen(false)
    setDismissedAddKey(addActionKey)
    setFormError('')
    setImageUploadHint('')
  }

  const handleSendBottle = () => {
    const content = messageText.trim()

    if (!content) {
      setFormError('先写下一点想投向这里的旅行故事、心情或攻略。')
      return
    }

    if (content.length > maxContentLength) {
      setFormError(`最多 ${maxContentLength} 字，请再精简一点。`)
      return
    }

    setSubmitting(true)

    createBottleMessage({
      destId: currentDestination.id,
      destName: currentDestination.name,
      parentId: currentDestination.parentId,
      type: 'wish',
      bottleType: selectedBottleType,
      content,
    })
      .then(() => {
        setMessageText('')
        setSelectedBottleType('normal')
        setManualAddSheetOpen(false)
        setDismissedAddKey(addActionKey)
        setImageUploadHint('')
        showToast(`已把漂流瓶投向 ${currentDestination.name}`)
        setRefreshSeed((prev) => prev + 1)
      })
      .catch((error: unknown) => {
        setFormError(
          error instanceof Error
            ? error.message
            : '投出漂流瓶失败，请稍后重试。',
        )
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <main className={styles.page}>
      <PageTopBar
        title="旅行漂流瓶"
        backLabel="返回"
        onBack={() => navigateBackOr(navigate, '/map')}
        rightAction={
          <button
            type="button"
            className={styles.topActionButton}
            onClick={() => showToast('筛选功能稍后接入')}
          >
            <FilterOutline aria-hidden="true" />
            筛选
          </button>
        }
      />

      <section
        className={styles.destinationHeader}
        aria-labelledby="bottle-title"
      >
        <div>
          <h1 id="bottle-title">{destinationDisplayName}</h1>
          <p>
            看看这里被留下了哪些关于 {destinationShortName} 的旅行故事 ·{' '}
            {bottleCount} 个漂流瓶
          </p>
        </div>
        <button
          type="button"
          className={styles.headerThrowButton}
          onClick={handleOpenAddSheet}
        >
          <BottleGlyph />
          扔瓶子
        </button>
      </section>

      <div className={styles.sortTabs} role="tablist" aria-label="漂流瓶排序">
        <button
          type="button"
          className={
            sortBy === 'latest' ? styles.sortTabActive : styles.sortTab
          }
          onClick={() => setSortBy('latest')}
          role="tab"
          aria-selected={sortBy === 'latest'}
        >
          最新
        </button>
        <button
          type="button"
          className={
            sortBy === 'hottest' ? styles.sortTabActive : styles.sortTab
          }
          onClick={() => setSortBy('hottest')}
          role="tab"
          aria-selected={sortBy === 'hottest'}
        >
          最热
        </button>
      </div>

      <div className={styles.filterChips} aria-label="漂流瓶类型筛选">
        {filterOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            className={
              activeFilter === option.key
                ? styles.filterChipActive
                : styles.filterChip
            }
            onClick={() => setActiveFilter(option.key)}
          >
            <BottleGlyph />
            {option.label}
          </button>
        ))}
      </div>

      {(destinationHint || sourceText) && (
        <p className={styles.contextHint}>{destinationHint || sourceText}</p>
      )}

      <section className={styles.listSection} aria-label="漂流瓶列表">
        {loading ? (
          <EmptyState
            title="正在同步漂流瓶"
            description={`正在读取 ${currentDestination.name} 的旅行纸条。`}
          />
        ) : loadError ? (
          <EmptyState
            title="漂流瓶加载失败"
            description={loadError}
            actionLabel="重新加载"
            onAction={() => setRefreshSeed((prev) => prev + 1)}
            role="alert"
          />
        ) : bottles.length > 0 ? (
          <div className={styles.bottleList}>
            {bottles.map((bottle) => (
              <article
                className={styles.listCard}
                key={bottle.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedBottleId(bottle.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedBottleId(bottle.id)
                  }
                }}
              >
                <span className={styles.cardAuthorRow}>
                  <img src={bottle.authorAvatar} alt="" aria-hidden="true" />
                  <span className={styles.cardBody}>
                    <span className={styles.cardTitleRow}>
                      <strong>{bottle.authorName}</strong>
                      {bottle.isFollowing && (
                        <span className={styles.followStateBadge}>已关注</span>
                      )}
                      <i>{typeLabels[bottle.type]}瓶</i>
                    </span>
                    <em>{bottle.authorPersona}</em>
                    <span className={styles.cardTags}>
                      {bottle.tags.slice(0, 4).map((tag) => (
                        <span key={tag}>
                          <TagOutline aria-hidden="true" />
                          {tag}
                        </span>
                      ))}
                    </span>
                    <span className={styles.cardMeta}>
                      <span>
                        <LocationOutline aria-hidden="true" />
                        <span>目的地：{destinationDisplayName}</span>
                      </span>
                      <span>
                        <CalendarOutline aria-hidden="true" />
                        <span>
                          {bottle.publishTimeText} · 来自 {bottle.authorCity}
                        </span>
                      </span>
                      <span>
                        <EditSOutline aria-hidden="true" />
                        <span>{bottle.summary}</span>
                      </span>
                    </span>
                  </span>
                </span>
                <button
                  type="button"
                  className={styles.cardAction}
                  onClick={(event) => {
                    event.stopPropagation()
                    setSelectedBottleId(bottle.id)
                  }}
                >
                  查看详情
                </button>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="这里还没有漂流瓶"
            description={`把第一段旅行心情投向 ${currentDestination.name}。`}
            actionLabel="扔一个漂流瓶"
            onAction={handleOpenAddSheet}
          />
        )}
      </section>
      {selectedBottle && (
        <BaseBottomSheet
          labelledBy="bottle-detail-title"
          closeLabel="关闭漂流瓶详情"
          onClose={() => setSelectedBottleId(null)}
        >
          <div className={styles.authorRow}>
            <img src={selectedBottle.authorAvatar} alt="" aria-hidden="true" />
            <div>
              <h2 id="bottle-detail-title">{selectedBottle.title}</h2>
              <p>
                来自 {selectedBottle.authorPersona} ·{' '}
                {selectedBottle.publishTimeText}
              </p>
            </div>
            <button
              type="button"
              className={
                selectedBottle.isFollowing
                  ? styles.followButtonActive
                  : styles.followButton
              }
              onClick={() => handleToggleFollow(selectedBottle.id)}
            >
              {selectedBottle.isFollowing ? '已关注' : '关注'}
            </button>
          </div>
          <img
            className={styles.detailImage}
            src={selectedBottle.images[0] || defaultBottleImage}
            alt={`${selectedBottle.title} 图片`}
          />
          <p className={styles.detailContent}>{selectedBottle.content}</p>
          <div className={styles.tags}>
            {selectedBottle.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className={styles.detailActions}>
            <button type="button" onClick={() => showToast('已发送招呼')}>
              <MessageOutline aria-hidden="true" />
              打招呼
            </button>
            <button
              type="button"
              className={selectedBottle.isLiked ? styles.actionActive : ''}
              onClick={() => handleToggleLike(selectedBottle.id)}
            >
              <HeartIcon filled={selectedBottle.isLiked} />
              {selectedBottle.likes}
            </button>
            <button
              type="button"
              className={selectedBottle.isCollected ? styles.actionActive : ''}
              onClick={() => handleToggleCollect(selectedBottle.id)}
            >
              <BookmarkIcon filled={selectedBottle.isCollected} />
              {selectedBottle.isCollected ? '已收藏' : '收藏'}
            </button>
          </div>
        </BaseBottomSheet>
      )}

      {addSheetOpen && (
        <BaseBottomSheet
          labelledBy="add-bottle-title"
          closeLabel="关闭发布漂流瓶"
          onClose={handleCloseAddSheet}
          variant="tall"
          className={styles.createSheetContent}
        >
          <h2 id="add-bottle-title">扔一个漂流瓶</h2>
          <p className={styles.locationLine}>
            内容将关联到：<strong>{destinationDisplayName}</strong>
            <button type="button" onClick={() => showToast('更换地点稍后接入')}>
              更换地点
            </button>
          </p>
          <label className={styles.textareaWrap}>
            <span className={styles.visuallyHidden}>漂流瓶内容</span>
            <TextArea
              value={messageText}
              maxLength={maxContentLength + 20}
              onChange={(value) => {
                setMessageText(value)
                setFormError('')
              }}
              placeholder="写下你的旅行故事、心情、攻略、求助..."
              rows={7}
              showCount={false}
            />
            <em>
              {Math.min(formCount, maxContentLength)}/{maxContentLength}
            </em>
          </label>
          <section className={styles.imageUploadBlock} aria-label="添加照片">
            <button
              type="button"
              className={styles.imageUploadPlaceholder}
              onClick={handleImagePlaceholderClick}
            >
              <strong>＋</strong>
            </button>
            <p>添加照片（最多9张）</p>
            {imageUploadHint && (
              <p className={styles.uploadHint}>{imageUploadHint}</p>
            )}
          </section>
          <div className={styles.createTypeTitle}>瓶子类型</div>
          <div className={styles.visibilityOptions}>
            {bottleTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={
                  selectedBottleType === option.value
                    ? styles.visibilityOptionActive
                    : styles.visibilityOption
                }
                onClick={() => setSelectedBottleType(option.value)}
              >
                <span className={styles.visibilityGlyph}>
                  <BottleGlyph />
                </span>
                <strong>{option.label}</strong>
                <small>{option.description}</small>
              </button>
            ))}
          </div>
          {formError && (
            <p className={styles.formError} role="alert">
              {formError}
            </p>
          )}
          <button
            className={styles.submitButton}
            type="button"
            onClick={handleSendBottle}
            disabled={submitting}
          >
            <BottleGlyph />
            {submitting ? '投递中...' : '扔出去'}
          </button>
        </BaseBottomSheet>
      )}
    </main>
  )
}

export default Bottle
