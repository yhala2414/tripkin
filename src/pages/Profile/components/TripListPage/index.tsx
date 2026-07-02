import { createPortal } from 'react-dom'
import type { ReactElement } from 'react'
import type { MockTrip } from '../../mock'
import styles from './TripListPage.module.less'

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

function StatusBadge({ status }: { status: MockTrip['status'] }) {
  return (
    <span
      className={`${styles.badge} ${status === 'progress' ? styles.badgeProgress : styles.badgeDone}`}
    >
      {status === 'progress' ? '进行中' : '已完成'}
    </span>
  )
}

interface TripListPageProps {
  visible: boolean
  trips?: (MockTrip & { distance?: string })[]
  onClose: () => void
}

export function TripListPage({
  visible,
  trips = [],
  onClose,
}: TripListPageProps) {
  if (!visible) return null

  const content = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        {/* ---- top bar ---- */}
        <div className={styles.topBar}>
          <button type="button" className={styles.backBtn} onClick={onClose}>
            <IconBack />
          </button>
          <span className={styles.topTitle}>{'我的行程'}</span>
          <div className={styles.topSpacer} />
        </div>

        {/* ---- stats header ---- */}
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <strong className={styles.statNum}>
              {trips.filter((t) => t.status === 'progress').length}
            </strong>
            <span className={styles.statText}>{'进行中'}</span>
          </div>
          <div className={styles.statItem}>
            <strong className={styles.statNum}>
              {trips.filter((t) => t.status === 'done').length}
            </strong>
            <span className={styles.statText}>{'已完成'}</span>
          </div>
          <div className={styles.statItem}>
            <strong className={styles.statNum}>{trips.length}</strong>
            <span className={styles.statText}>{'全部行程'}</span>
          </div>
        </div>

        {/* ---- trip list ---- */}
        <div className={styles.body}>
          {trips.length === 0 ? (
            <div className={styles.emptyState}>
              <strong>{'还没有行程记录'}</strong>
              <span>{'申请加入行程后，记录会沉淀到这里。'}</span>
            </div>
          ) : (
            trips.map((trip, i) => (
              <article key={i} className={styles.card}>
                <span
                  className={`${styles.dot} ${trip.status === 'progress' ? styles.dotProgress : styles.dotDone}`}
                />
                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{trip.title}</h3>
                    <StatusBadge status={trip.status} />
                  </div>
                  <p className={styles.cardMeta}>
                    {trip.destination} · {trip.dateRange}
                    {trip.distance ? ` · ${trip.distance}` : ''}
                  </p>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
