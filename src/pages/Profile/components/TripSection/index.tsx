import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MockTripStats } from '../../mock'
import { TripListPage } from '../TripListPage'
import styles from './TripSection.module.less'

interface TripSectionProps {
  tripStats: MockTripStats
}

export function TripSection({ tripStats }: TripSectionProps) {
  const navigate = useNavigate()
  const [tripsOpen, setTripsOpen] = useState(false)
  const hasTrips = tripStats.recentTrips.length > 0

  return (
    <section className={styles.section}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{'\u6211\u7684\u884C\u7A0B'}</h2>
        {/* 查看全部：点击打开行程列表完整页面 */}
        <button
          type="button"
          className={styles.viewAll}
          onClick={() => setTripsOpen(true)}
        >
          {'\u67E5\u770B\u5168\u90E8 \u203A'}
        </button>
      </header>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <strong className={styles.summaryValue}>
            {tripStats.inProgress}
          </strong>
          <span className={styles.summaryLabel}>{'\u8FDB\u884C\u4E2D'}</span>
        </div>
        <div className={styles.summaryCard}>
          <strong className={styles.summaryValue}>{tripStats.completed}</strong>
          <span className={styles.summaryLabel}>{'\u5DF2\u5B8C\u6210'}</span>
        </div>
        <div className={styles.summaryCard}>
          <strong className={styles.summaryValue}>
            {tripStats.nextDeparture}
          </strong>
          <span className={styles.summaryLabel}>
            {'\u4E0B\u6B21\u51FA\u53D1'}
          </span>
        </div>
      </div>

      {hasTrips ? (
        <div className={styles.tripList}>
          {tripStats.recentTrips.map((trip, i) => (
            <article
              key={i}
              className={styles.tripCard}
              onClick={() => navigate('/map')}
            >
              <span
                className={`${styles.tripStatus} ${trip.status === 'progress' ? styles.tripStatusProgress : styles.tripStatusDone}`}
              />
              <div className={styles.tripInfo}>
                <h3 className={styles.tripTitle}>{trip.title}</h3>
                <p className={styles.tripMeta}>
                  {trip.destination} {'\u00B7'} {trip.dateRange}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <strong>{'还没有行程申请沉淀'}</strong>
          <span>{'在匹配页申请加入行程后，这里会同步显示记录。'}</span>
          <button type="button" onClick={() => navigate('/match?tab=trip')}>
            {'去找行程'}
          </button>
        </div>
      )}

      <TripListPage
        visible={tripsOpen}
        trips={tripStats.recentTrips}
        onClose={() => setTripsOpen(false)}
      />
    </section>
  )
}
