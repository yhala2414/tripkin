import { Popup, TextArea, Toast } from 'antd-mobile'
import { useState } from 'react'
import { createTripApplication } from '@/services/userAssetService'
import type { TripMatchCardData } from '../../types'
import GradientVisual from '../GradientVisual'
import MatchIcon from '../MatchIcon'
import styles from './JoinTripSheet.module.less'

interface JoinTripSheetProps {
  trip: TripMatchCardData | null
  visible: boolean
  onClose: () => void
}

function JoinTripSheet({ trip, visible, onClose }: JoinTripSheetProps) {
  const [message, setMessage] = useState('')

  if (!trip) {
    return null
  }

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyClassName={styles.popupBody}
      position="bottom"
    >
      <section className={styles.sheet} aria-label="申请加入行程">
        <div className={styles.dragBar} aria-hidden="true" />
        <button type="button" className={styles.closeButton} onClick={onClose}>
          <MatchIcon name="close" />
          <span className={styles.srOnly}>关闭</span>
        </button>

        <h2 className={styles.title}>申请加入行程</h2>

        <article className={styles.summaryCard}>
          <GradientVisual
            tone={trip.imageTone}
            mark={trip.organizerName}
            className={styles.image}
          />
          <div>
            <h3 className={styles.tripTitle}>{trip.title}</h3>
            <div className={styles.badges}>
              <span>{trip.status === 'OPEN' ? '招募中' : '暂不可申请'}</span>
              <span>{trip.people.replace('人 / ', '/')}</span>
              <span>{trip.duration}</span>
            </div>
            <p className={styles.tripSummary}>
              {trip.identityStatus} · {trip.summary}
            </p>
          </div>
        </article>

        <label className={styles.label} htmlFor="join-trip-message">
          申请说明（建议填写）
        </label>
        <div className={styles.textAreaWrap}>
          <TextArea
            id="join-trip-message"
            value={message}
            onChange={setMessage}
            maxLength={200}
            showCount
            placeholder="简单说说你的出行时间、旅行偏好和想加入的原因..."
            rows={5}
          />
        </div>

        <div className={styles.tips}>
          <span>
            <MatchIcon name="clock" />
            预计 24 小时内回复
          </span>
          <span>
            <MatchIcon name="people" />
            通过后开放更多资料
          </span>
        </div>

        <footer className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            取消
          </button>
          <button
            type="button"
            className={styles.confirm}
            onClick={() => {
              createTripApplication(trip, message.trim())
              setMessage('')
              Toast.show({ content: '申请已提交，状态：待处理' })
              onClose()
            }}
          >
            提交申请
          </button>
        </footer>
      </section>
    </Popup>
  )
}

export default JoinTripSheet
