import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { StarOutline } from 'antd-mobile-icons'
import { useTripStore } from '@/store/useTripStore'
import { useUserAssetStore } from '@/store/useUserAssetStore'
import { TravelIdentityCard } from './components/TravelIdentityCard'
import { TravelPersonaSection } from './components/TravelPersonaSection'
import { MatchingProfileSection } from './components/MatchingProfileSection'
import { TravelStorySection } from './components/TravelStorySection'
import { TripSection } from './components/TripSection'
import { FootprintSection } from './components/FootprintSection'
import { TravelAchievementSection } from './components/TravelAchievementSection'
import { CollectionSection } from './components/CollectionSection'
import { SettingSection } from './components/SettingSection'
import { mockProfileData } from './mock'
import type { MockTrip } from './mock'
import type { CompanionHistoryItem } from './components/CompanionHistory'
import type { MockStory } from './components/TravelStoriesPage/mockStories'
import type {
  MockFavoriteBottle,
  MockFavoriteCompanion,
  MockFavoriteDestination,
} from './mockFavorites'
import styles from './Profile.module.less'

function getDateText(iso: string) {
  return iso.slice(0, 10)
}

function Profile() {
  const navigate = useNavigate()
  const personaId = useTripStore((s) => s.personaId)
  const nickname = useTripStore((s) => s.nickname)
  const mbtiTypeCn = useTripStore((s) => s.mbtiTypeCn)
  const classicMbti = useTripStore((s) => s.classicMbti)
  const tagline = useTripStore((s) => s.tagline)
  const tags = useTripStore((s) => s.tags)
  const createdBottles = useUserAssetStore((s) => s.createdBottles)
  const savedBottleIds = useUserAssetStore((s) => s.savedBottleIds)
  const savedBottleSnapshots = useUserAssetStore((s) => s.savedBottleSnapshots)
  const tripApplications = useUserAssetStore((s) => s.tripApplications)
  const companionInvitations = useUserAssetStore((s) => s.companionInvitations)
  const savedCompanionIds = useUserAssetStore((s) => s.savedCompanionIds)
  const savedCompanionSnapshots = useUserAssetStore(
    (s) => s.savedCompanionSnapshots,
  )
  const savedDestinationIds = useUserAssetStore((s) => s.savedDestinationIds)
  const savedDestinationSnapshots = useUserAssetStore(
    (s) => s.savedDestinationSnapshots,
  )

  const hasPersona = personaId !== null
  const handleSaveAccount = (newNickname: string, newTagline: string) => {
    useTripStore.setState({ nickname: newNickname, tagline: newTagline })
  }
  const storyItems = useMemo<MockStory[]>(
    () =>
      createdBottles.map((bottle) => ({
        id: bottle.id,
        city: bottle.destinationName,
        title: bottle.title,
        summary: bottle.summary,
        publishDate: getDateText(bottle.publishTime),
        replyCount: bottle.comments,
        favoriteCount: bottle.likes,
        category: 'mine',
      })),
    [createdBottles],
  )
  const featuredStories = useMemo(
    () =>
      createdBottles.slice(0, 2).map((bottle) => ({
        title: bottle.title,
        destination: bottle.destinationName,
        snippet: bottle.summary,
      })),
    [createdBottles],
  )
  const bottleStats = useMemo(
    () => ({
      sent: createdBottles.length,
      replies: 0,
      featured: 0,
    }),
    [createdBottles.length],
  )
  const recentTrips = useMemo<MockTrip[]>(
    () =>
      tripApplications.map((application) => ({
        title: application.tripTitle,
        destination: application.destination,
        dateRange: `申请于 ${getDateText(application.createdAt)}`,
        status: application.status === 'pending' ? 'progress' : 'done',
      })),
    [tripApplications],
  )
  const tripStats = useMemo(
    () => ({
      inProgress: tripApplications.filter(
        (application) => application.status === 'pending',
      ).length,
      completed: tripApplications.filter(
        (application) => application.status !== 'pending',
      ).length,
      nextDeparture:
        tripApplications.length > 0
          ? getDateText(tripApplications[0].createdAt)
          : '暂无',
      recentTrips,
    }),
    [recentTrips, tripApplications],
  )
  const companionHistoryItems = useMemo<CompanionHistoryItem[]>(
    () =>
      companionInvitations.map((invitation) => ({
        id: invitation.id,
        name: invitation.companionName,
        avatarEmoji: '🤝',
        mbti: invitation.classicMbti ?? 'MBTI',
        persona: invitation.personaLabel ?? '旅行搭子',
        matchDate: getDateText(invitation.createdAt),
        tripTogether: invitation.message || '同行邀请',
        status: invitation.status === 'sent' ? '邀请中' : '已完成',
      })),
    [companionInvitations],
  )
  const matchingProfile = useMemo(() => {
    const invitationBreakdown = companionInvitations.reduce<
      Record<
        string,
        { label: string; mbti: string; emoji: string; count: number }
      >
    >((result, invitation) => {
      const label = invitation.personaLabel ?? '旅行搭子'
      result[label] = {
        label,
        mbti: invitation.classicMbti ?? 'MBTI',
        emoji: '🤝',
        count: (result[label]?.count ?? 0) + 1,
      }

      return result
    }, {})

    return {
      totalMatches: companionInvitations.length,
      activeCompanions: companionInvitations.filter(
        (invitation) => invitation.status === 'sent',
      ).length,
      matchBreakdown: Object.values(invitationBreakdown),
    }
  }, [companionInvitations])
  const favoriteBottleItems = useMemo<MockFavoriteBottle[]>(
    () =>
      savedBottleSnapshots.map((bottle) => ({
        id: bottle.id,
        cityTag: bottle.destinationName,
        title: bottle.title,
        snippet: bottle.summary,
        collectedAt: getDateText(bottle.publishTime),
      })),
    [savedBottleSnapshots],
  )
  const favoriteCompanionItems = useMemo<MockFavoriteCompanion[]>(
    () =>
      savedCompanionSnapshots.map((companion) => ({
        id: companion.id,
        avatarEmoji: companion.avatarEmoji,
        nickname: companion.nickname,
        mbti: companion.mbti,
        personalityLabel: companion.personalityLabel,
        tags: companion.tags,
        travelStyle: companion.travelStyle,
        collectedAt: companion.collectedAt,
      })),
    [savedCompanionSnapshots],
  )
  const favoriteDestinationItems = useMemo<MockFavoriteDestination[]>(
    () =>
      savedDestinationSnapshots.map((destination) => ({
        id: destination.id,
        cityName: destination.cityName,
        coverEmoji: destination.coverEmoji,
        reason: destination.reason,
        collectedAt: destination.collectedAt,
      })),
    [savedDestinationSnapshots],
  )
  const collectionStats = useMemo(
    () => ({
      destinations: savedDestinationIds.length,
      bottles: savedBottleIds.length,
      companions: savedCompanionIds.length,
    }),
    [
      savedBottleIds.length,
      savedCompanionIds.length,
      savedDestinationIds.length,
    ],
  )

  if (!hasPersona) {
    return (
      <main className={styles.page}>
        <section className={styles.emptyState}>
          <span className={styles.emptyEmoji} aria-hidden="true">
            <StarOutline aria-hidden="true" />
          </span>
          <h1 className={styles.emptyTitle}>{'你的旅行人格'}</h1>
          <p className={styles.emptyDesc}>
            {'完成旅行 MBTI，探索你的旅行风格，'}
            {'生成属于你的旅行身份卡。'}
          </p>
          <button
            type="button"
            className={styles.goMbtiBtn}
            onClick={() => navigate('/mbti')}
          >
            {'开始探索'}
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={`${styles.glassCard} ${styles.identityCard}`}>
        <TravelIdentityCard
          personaId={personaId}
          nickname={nickname}
          mbtiTypeCn={mbtiTypeCn}
          classicMbti={classicMbti}
          tags={tags}
          tagline={tagline}
          travelLevel={mockProfileData.travelLevel}
          onSaveProfile={handleSaveAccount}
        />
      </div>

      <section className={styles.profileGroup} aria-labelledby="profile-assets">
        <h2 id="profile-assets" className={styles.groupTitle}>
          当前旅行资产
        </h2>
        <div className={styles.glassCard}>
          <TravelPersonaSection
            personaId={personaId}
            travelIndices={mockProfileData.travelIndices}
          />
        </div>
        <div className={styles.glassCard}>
          <MatchingProfileSection
            matchingProfile={matchingProfile}
            companionHistoryItems={companionHistoryItems}
          />
        </div>
        <div className={styles.glassCard}>
          <TravelStorySection
            bottleStats={bottleStats}
            featuredStories={featuredStories}
            storyItems={storyItems}
          />
        </div>
        <div className={styles.glassCard}>
          <TripSection tripStats={tripStats} />
        </div>
        <div className={styles.glassCard}>
          <CollectionSection
            collectionStats={collectionStats}
            destinationItems={favoriteDestinationItems}
            bottleItems={favoriteBottleItems}
            companionItems={favoriteCompanionItems}
          />
        </div>
      </section>

      <section
        className={`${styles.profileGroup} ${styles.longTermGroup}`}
        aria-labelledby="profile-history"
      >
        <h2 id="profile-history" className={styles.groupTitle}>
          旅行历程
        </h2>
        <div className={`${styles.glassCard} ${styles.secondaryCard}`}>
          <FootprintSection footprintStats={mockProfileData.footprintStats} />
        </div>
        <div className={`${styles.glassCard} ${styles.secondaryCard}`}>
          <TravelAchievementSection
            achievements={mockProfileData.achievements}
          />
        </div>
      </section>

      <section
        className={`${styles.profileGroup} ${styles.settingsGroup}`}
        aria-labelledby="profile-settings"
      >
        <h2 id="profile-settings" className={styles.groupTitle}>
          账号与设置
        </h2>
        <div className={`${styles.glassCard} ${styles.settingsCard}`}>
          <SettingSection
            settingsItems={mockProfileData.settingsItems}
            nickname={nickname ?? '旅行者'}
            tagline={tagline ?? ''}
            onSaveAccount={handleSaveAccount}
          />
        </div>
      </section>
    </main>
  )
}

export default Profile
