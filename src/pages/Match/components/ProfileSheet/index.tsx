import { Popup, Toast } from 'antd-mobile'
import { createCompanionInvitation } from '@/services/userAssetService'
import type { PartnerMatchCardData } from '../../types'
import MatchIcon from '../MatchIcon'
import styles from './ProfileSheet.module.less'

interface ProfileSheetProps {
  partner: PartnerMatchCardData | null
  visible: boolean
  onClose: () => void
}

function ProfileSheet({ partner, visible, onClose }: ProfileSheetProps) {
  if (!partner) {
    return null
  }

  const personaText = partner.persona
    ? `${partner.persona.tripkinTitleCn} · ${partner.classicMbti}`
    : partner.personality

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyClassName={styles.popupBody}
      position="bottom"
    >
      <section className={styles.sheet} aria-label="搭子身份卡">
        <div className={styles.dragBar} aria-hidden="true" />
        <button type="button" className={styles.closeButton} onClick={onClose}>
          <MatchIcon name="close" />
          <span className={styles.srOnly}>关闭</span>
        </button>

        <header className={styles.profileHeader}>
          <img
            className={styles.avatar}
            src={partner.avatarUrl}
            alt={partner.avatarAlt}
          />
          <div>
            <h2 className={styles.name}>{partner.name}</h2>
            <p className={styles.status}>
              {partner.profileStatus} · {partner.identityStatus} ·{' '}
              {partner.activeTime}
            </p>
          </div>
        </header>

        <div className={styles.personality}>
          <p className={styles.personalityTitle}>
            <MatchIcon name="heart" />
            {personaText} · 匹配度 {partner.matchScore}%
          </p>
          <div className={styles.interests}>
            {partner.interests.map((interest) => (
              <span key={interest.label} className={styles.interest}>
                <MatchIcon name={interest.icon} />
                {interest.label}
              </span>
            ))}
          </div>
          <blockquote className={styles.quote}>
            {partner.profileQuote}
          </blockquote>
        </div>

        <h3 className={styles.sectionTitle}>匹配原因</h3>
        <div className={styles.reasons}>
          {partner.matchReasons.map((reason) => (
            <span key={reason.label} className={styles.reason}>
              <MatchIcon name={reason.icon} />
              {reason.label}
            </span>
          ))}
        </div>

        <footer className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryAction}
            onClick={() => Toast.show({ content: '已打开安全操作入口' })}
          >
            举报/拉黑
          </button>
          <button
            type="button"
            className={styles.primaryAction}
            onClick={() => {
              createCompanionInvitation(partner)
              Toast.show({ content: '已发起同行邀请' })
            }}
          >
            发起同行邀请
            <MatchIcon name="send" />
          </button>
        </footer>
      </section>
    </Popup>
  )
}

export default ProfileSheet
