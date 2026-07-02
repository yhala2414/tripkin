import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MockMatchingProfile } from '../../mock'
import { CompanionHistory } from '../CompanionHistory'
import type { CompanionHistoryItem } from '../CompanionHistory'
import styles from './MatchingProfileSection.module.less'

interface MatchingProfileSectionProps {
  matchingProfile: MockMatchingProfile
  companionHistoryItems: CompanionHistoryItem[]
}

function BarChart({
  data,
  max,
}: {
  data: MockMatchingProfile['matchBreakdown']
  max: number
}) {
  return (
    <div className={styles.barList}>
      {data.map((item) => {
        const pct = Math.round((item.count / max) * 100)
        return (
          <div key={item.label} className={styles.barItem}>
            <span className={styles.barEmoji}>{item.emoji}</span>
            <div className={styles.barBody}>
              <div className={styles.barLabel}>
                <span className={styles.barName}>{item.label}</span>
                <span className={styles.barMbti}>{item.mbti}</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
            <span className={styles.barCount}>{item.count}次</span>
          </div>
        )
      })}
    </div>
  )
}

export function MatchingProfileSection({
  matchingProfile,
  companionHistoryItems,
}: MatchingProfileSectionProps) {
  const navigate = useNavigate()
  const [historyOpen, setHistoryOpen] = useState(false)
  const hasMatchAssets = companionHistoryItems.length > 0
  const maxCount = Math.max(
    ...matchingProfile.matchBreakdown.map((m) => m.count),
    1,
  )

  return (
    <section className={styles.section}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🤝</span>
          {'匹配档案'}
        </h2>
      </header>

      <div className={styles.statsRow}>
        <div
          className={`${styles.statCard} ${styles.statCardClickable}`}
          onClick={() => setHistoryOpen(true)}
        >
          <strong className={styles.statValue}>
            {matchingProfile.totalMatches}
          </strong>
          <span className={styles.statLabel}>{'总匹配'}</span>
          <span className={styles.statHint}>{'查看记录 →'}</span>
        </div>
        <div className={styles.statCard}>
          <strong className={styles.statValue}>
            {matchingProfile.activeCompanions}
          </strong>
          <span className={styles.statLabel}>{'活跃搭子'}</span>
        </div>
      </div>

      <div className={styles.divider} />

      <h3 className={styles.subtitle}>{'人格吸引力分布'}</h3>
      {hasMatchAssets ? (
        <BarChart data={matchingProfile.matchBreakdown} max={maxCount} />
      ) : (
        <div className={styles.emptyState}>
          <strong>{'还没有搭子沉淀'}</strong>
          <span>{'发起同行邀请后，这里会汇总你的匹配记录。'}</span>
        </div>
      )}

      <button
        type="button"
        className={styles.cta}
        onClick={() => navigate('/match')}
      >
        {'发现新搭子'}
      </button>

      <CompanionHistory
        visible={historyOpen}
        items={companionHistoryItems}
        onClose={() => setHistoryOpen(false)}
      />
    </section>
  )
}
