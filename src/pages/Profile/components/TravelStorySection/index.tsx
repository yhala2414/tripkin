import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MockBottleStats, MockFeaturedStory } from '../../mock'
import { TravelStoriesPage } from '../TravelStoriesPage'
import type { MockStory } from '../TravelStoriesPage/mockStories'
import styles from './TravelStorySection.module.less'

interface TravelStorySectionProps {
  bottleStats: MockBottleStats
  featuredStories: MockFeaturedStory[]
  storyItems: MockStory[]
}

export function TravelStorySection({
  bottleStats,
  featuredStories,
  storyItems,
}: TravelStorySectionProps) {
  const navigate = useNavigate()
  const [storiesOpen, setStoriesOpen] = useState(false)

  return (
    <section className={styles.section}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>{'\uD83D\uDCDC'}</span>
          {'\u65C5\u884C\u6545\u4E8B'}
        </h2>
        <span className={styles.viewAll} onClick={() => setStoriesOpen(true)}>
          {'\u67E5\u770B\u5168\u90E8 \u203A'}
        </span>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <strong className={styles.statValue}>{bottleStats.sent}</strong>
          <span className={styles.statLabel}>
            {'\u53D1\u5E03\u6F02\u6D41\u74F6'}
          </span>
        </div>
        <div className={styles.statCard}>
          <strong className={styles.statValue}>{bottleStats.replies}</strong>
          <span className={styles.statLabel}>{'\u6536\u5230\u56DE\u590D'}</span>
        </div>
        <div className={styles.statCard}>
          <strong className={styles.statValue}>{bottleStats.featured}</strong>
          <span className={styles.statLabel}>{'\u7CBE\u9009\u6545\u4E8B'}</span>
        </div>
      </div>

      {featuredStories.length > 0 && (
        <div className={styles.storyList}>
          {featuredStories.map((story) => (
            <article
              key={story.title}
              className={styles.storyCard}
              onClick={() => navigate('/bottle')}
            >
              <div className={styles.storyMeta}>
                <span className={styles.storyDest}>{story.destination}</span>
              </div>
              <h3 className={styles.storyTitle}>{story.title}</h3>
              <p className={styles.storySnippet}>{story.snippet}</p>
            </article>
          ))}
        </div>
      )}
      {featuredStories.length === 0 && (
        <div className={styles.emptyState}>
          <strong>{'还没有旅行故事沉淀'}</strong>
          <span>{'去漂流瓶发布第一段旅程后，这里会同步展示。'}</span>
          <button type="button" onClick={() => navigate('/bottle')}>
            {'去写漂流瓶'}
          </button>
        </div>
      )}

      <TravelStoriesPage
        visible={storiesOpen}
        stories={storyItems}
        onClose={() => setStoriesOpen(false)}
      />
    </section>
  )
}
