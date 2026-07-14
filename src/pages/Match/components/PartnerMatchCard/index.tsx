import type { PartnerMatchCardData } from '../../types'
import MatchIcon from '../MatchIcon'
import styles from './PartnerMatchCard.module.less'

interface PartnerMatchCardProps {
  item: PartnerMatchCardData
  onOpen: (item: PartnerMatchCardData) => void
}

function PartnerMatchCard({ item, onOpen }: PartnerMatchCardProps) {
  return (
    <article className={styles.card} onClick={() => onOpen(item)}>
      <span className={styles.avatarWrap}>
        <img
          className={styles.avatar}
          src={item.avatarUrl}
          alt={item.avatarAlt}
        />
        {item.online ? (
          <span className={styles.online} aria-hidden="true" />
        ) : null}
      </span>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <div className={styles.nameGroup}>
            <h2 className={styles.name}>{item.name}</h2>
            <span className={styles.identity}>{item.identityStatus}</span>
          </div>
          <span className={styles.score}>匹配度 {item.matchScore}%</span>
        </div>

        {item.persona && (
          <span className={styles.persona}>
            {item.persona.emoji} {item.persona.tripkinTitleCn} ·{' '}
            {item.classicMbti}
          </span>
        )}

        <div className={styles.tags}>
          {item.interests.map((interest) => (
            <span key={interest.label} className={styles.tag}>
              <MatchIcon name={interest.icon} />
              {interest.label}
            </span>
          ))}
        </div>

        <button
          type="button"
          className={styles.action}
          onClick={(event) => {
            event.stopPropagation()
            onOpen(item)
          }}
        >
          查看资料
        </button>

        <div className={styles.meta}>
          <p className={styles.metaRow}>
            <MatchIcon name="pin" />
            <span>目的地：{item.destination}</span>
          </p>
          <p className={styles.metaRow}>
            <MatchIcon name="calendar" />
            <span>出发时间：{item.departure}</span>
          </p>
          <p className={styles.metaRow}>
            <MatchIcon name="car" />
            <span>旅行方式：{item.travelWay}</span>
          </p>
          <p className={styles.metaRow}>
            <MatchIcon name="people" />
            <span>同行偏好：{item.groupPreference}</span>
          </p>
        </div>

        <div className={styles.reasonList} aria-label="匹配理由">
          {item.matchReasons.slice(0, 3).map((reason) => (
            <span key={reason.label}>· {reason.label}</span>
          ))}
        </div>
        <p className={styles.summary}>{item.summary}</p>
        <p className={styles.activeTime}>{item.activeTime}</p>
      </div>
    </article>
  )
}

export default PartnerMatchCard
