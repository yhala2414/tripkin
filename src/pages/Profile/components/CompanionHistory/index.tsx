import { createPortal } from 'react-dom'
import type { ReactElement } from 'react'
import styles from './CompanionHistory.module.less'

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

export interface CompanionHistoryItem {
  id: number | string
  name: string
  avatarEmoji: string
  mbti: string
  persona: string
  matchDate: string
  tripTogether: string
  status: string
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === '同行中' || status === '邀请中'
  return (
    <span
      className={`${styles.statusBadge} ${isActive ? styles.statusActive : styles.statusDone}`}
    >
      {status}
    </span>
  )
}

interface CompanionHistoryProps {
  visible: boolean
  items?: CompanionHistoryItem[]
  onClose: () => void
}

export function CompanionHistory({
  visible,
  items = [],
  onClose,
}: CompanionHistoryProps) {
  if (!visible) return null

  const content = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        {/* ---- top bar ---- */}
        <div className={styles.topBar}>
          <button type="button" className={styles.backBtn} onClick={onClose}>
            <IconBack />
          </button>
          <span className={styles.topTitle}>{'同行记录'}</span>
          <div className={styles.topSpacer} />
        </div>

        {/* ---- summary ---- */}
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <strong className={styles.summaryValue}>{items.length}</strong>
            <span className={styles.summaryLabel}>{'历史搭子'}</span>
          </div>
          <div className={styles.summaryItem}>
            <strong className={styles.summaryValue}>
              {items.filter((c) => c.status === '同行中').length}
            </strong>
            <span className={styles.summaryLabel}>{'同行中'}</span>
          </div>
          <div className={styles.summaryItem}>
            <strong className={styles.summaryValue}>
              {items.filter((c) => c.status === '已完成').length}
            </strong>
            <span className={styles.summaryLabel}>{'已完成'}</span>
          </div>
        </div>

        {/* ---- list ---- */}
        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <strong>{'还没有同行记录'}</strong>
              <span>{'发起同行邀请后，记录会沉淀到这里。'}</span>
            </div>
          ) : (
            <div className={styles.list}>
              {items.map((item) => (
                <article key={item.id} className={styles.card}>
                  <span className={styles.cardEmoji}>{item.avatarEmoji}</span>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardNameRow}>
                      <h3 className={styles.cardName}>{item.name}</h3>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className={styles.cardMeta}>
                      {item.mbti} · {item.persona}
                    </p>
                    <p className={styles.cardTrip}>
                      {'🧳 '}
                      {item.tripTogether}
                    </p>
                  </div>
                  <span className={styles.cardDate}>{item.matchDate}</span>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
