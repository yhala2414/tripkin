import { CloseOutline } from 'antd-mobile-icons'
import styles from './MbtiEntryModal.module.less'

interface MbtiEntryModalProps {
  open: boolean
  onEnter: () => void
  onClose: () => void
}

function MbtiEntryModal({ open, onEnter, onClose }: MbtiEntryModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className={styles.overlay} role="presentation">
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mbti-entry-title"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="关闭旅行 MBTI 引导"
        >
          <CloseOutline aria-hidden="true" />
        </button>
        <div className={styles.visual} aria-hidden="true">
          <span className={styles.orb} />
          <span className={styles.marker}>MBTI</span>
        </div>
        <p className={styles.kicker}>旅行人格入口</p>
        <h2 id="mbti-entry-title">测测你的旅行 MBTI</h2>
        <p className={styles.description}>
          了解你的旅行风格，发现更适合你的旅伴与目的地。
        </p>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onEnter}
        >
          进入 MBTI 首页
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onClose}
        >
          稍后再说
        </button>
      </section>
    </div>
  )
}

export default MbtiEntryModal
