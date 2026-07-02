import { useState, useMemo, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { Toast } from 'antd-mobile'
import type { MockStory } from './mockStories'
import styles from './TravelStoriesPage.module.less'

function IconBack(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="20"
      height="20"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function IconReply(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="12"
      height="12"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function IconHeart(): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="12"
      height="12"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

type TabKey = 'all' | 'mine' | 'reply' | 'featured'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'mine', label: '我发布的' },
  { key: 'reply', label: '收到回复' },
  { key: 'featured', label: '精选故事' },
]

function StoryCard({ story }: { story: MockStory }) {
  return (
    <article
      className={styles.card}
      onClick={() => Toast.show({ content: '详情页暂未开放', duration: 1500 })}
    >
      <div className={styles.cardHead}>
        <span className={styles.cardCity}>{story.city}</span>
        <span className={styles.cardDate}>{story.publishDate}</span>
      </div>
      <h3 className={styles.cardTitle}>{story.title}</h3>
      <p className={styles.cardSummary}>{story.summary}</p>
      <div className={styles.cardFooter}>
        <span className={styles.cardStat}>
          <IconReply />
          {story.replyCount}
        </span>
        <span className={styles.cardStat}>
          <IconHeart />
          {story.favoriteCount}
        </span>
      </div>
    </article>
  )
}

function EmptyState({ tabKey }: { tabKey: TabKey }) {
  const messages: Record<TabKey, string> = {
    all: '还没有旅行故事\n去漂流瓶记录你的第一段旅程',
    mine: '你还没有发布故事\n去漂流瓶写下第一个故事',
    reply: '还没有收到回复\n多去互动吧',
    featured: '还没有精选故事\n发布精彩故事获取精选',
  }
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}>📜</span>
      <p className={styles.emptyText}>{messages[tabKey]}</p>
    </div>
  )
}

interface TravelStoriesPageProps {
  visible: boolean
  stories?: MockStory[]
  onClose: () => void
}

export function TravelStoriesPage({
  visible,
  stories = [],
  onClose,
}: TravelStoriesPageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('all')

  const filteredStories = useMemo(() => {
    if (activeTab === 'all') return stories
    return stories.filter((s) => s.category === activeTab)
  }, [activeTab, stories])

  if (!visible) return null

  const content = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        {/* ---- top bar ---- */}
        <div className={styles.topBar}>
          <button type="button" className={styles.backBtn} onClick={onClose}>
            <IconBack />
          </button>
          <div className={styles.topCenter}>
            <span className={styles.topTitle}>{'旅行故事'}</span>
            <span className={styles.topSubtitle}>
              {'记录旅途中遇见的人与故事'}
            </span>
          </div>
          <div className={styles.topSpacer} />
        </div>

        {/* ---- tabs ---- */}
        <div className={styles.tabBar}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ---- content ---- */}
        <div className={styles.body}>
          {filteredStories.length === 0 ? (
            <EmptyState tabKey={activeTab} />
          ) : (
            <div className={styles.timeline}>
              {filteredStories.map((story) => (
                <div key={story.id} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <StoryCard story={story} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
