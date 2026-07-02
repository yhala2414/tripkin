import { useState } from 'react'
import { CompassOutline, EditSOutline, GlobalOutline } from 'antd-mobile-icons'
import { PERSONALITIES } from '@/pages/Mbti/data'
import { PersonaAvatar } from '@/pages/Mbti/components/PersonaAvatar'
import type { PersonaId } from '@/types/mbti'
import { getPersonaPresentation } from '@/utils/personaPresentation'
import type { MockTravelLevel } from '../../mock'
import { EditProfileSheet } from '../EditProfileSheet'
import type { EditProfileData } from '../EditProfileSheet'
import styles from './TravelIdentityCard.module.less'

interface TravelIdentityCardProps {
  personaId: PersonaId | null
  nickname: string | null
  mbtiTypeCn: string | null
  classicMbti: string | null
  tags: string[]
  tagline: string | null
  travelLevel: MockTravelLevel
  onSaveProfile: (nickname: string, tagline: string) => void
}

export function TravelIdentityCard({
  personaId,
  nickname,
  mbtiTypeCn,
  classicMbti,
  tags,
  tagline,
  travelLevel,
  onSaveProfile,
}: TravelIdentityCardProps) {
  const presentation = personaId ? getPersonaPresentation(personaId) : null
  const persona = personaId ? PERSONALITIES[personaId] : null
  const displayTitle = presentation?.tripkinTitleCn ?? mbtiTypeCn ?? '未知'
  const displayMbti = presentation?.classicMbti ?? classicMbti
  const displayTags = persona?.tags ?? presentation?.tags ?? tags
  const displayTagline = presentation?.tagline ?? tagline
  const displayNickname = nickname ?? '旅行者'
  const editableTagline = tagline ?? displayTagline ?? ''

  const [editOpen, setEditOpen] = useState(false)

  const levelPct =
    travelLevel.nextExp > 0
      ? Math.round((travelLevel.exp / travelLevel.nextExp) * 100)
      : 0

  const handleSave = (data: EditProfileData) => {
    onSaveProfile(data.nickname, data.tagline)
    setEditOpen(false)
  }

  return (
    <section className={styles.card}>
      <div className={styles.topStrip}>
        <span className={styles.levelBadge}>
          <CompassOutline aria-hidden="true" />
          <span>
            Lv.{travelLevel.level} · {travelLevel.title}
          </span>
        </span>
        <button
          type="button"
          className={styles.editBtn}
          aria-label="编辑资料"
          onClick={() => setEditOpen(true)}
        >
          <EditSOutline aria-hidden="true" />
        </button>
      </div>

      {personaId ? (
        <div className={styles.avatarWrap}>
          <PersonaAvatar id={personaId} />
        </div>
      ) : (
        <div className={styles.avatarPlaceholder}>
          <GlobalOutline aria-hidden="true" />
        </div>
      )}

      <h1 className={styles.nickname}>{displayNickname}</h1>

      <span className={styles.personaBadge}>
        <CompassOutline aria-hidden="true" />
        {displayTitle}
        {displayMbti ? ` · ${displayMbti}` : ''}
      </span>

      <div className={styles.expWrap}>
        <div className={styles.expHeader}>
          <span className={styles.expLabel}>EXP</span>
          <span className={styles.expValue}>
            {travelLevel.exp}/{travelLevel.nextExp}
          </span>
        </div>
        <div className={styles.expTrack}>
          <div
            className={styles.expFill}
            style={{ width: `${Math.min(levelPct, 100)}%` }}
          />
        </div>
      </div>

      {editableTagline && <p className={styles.slogan}>{editableTagline}</p>}

      {displayTags.length > 0 && (
        <div className={styles.tags}>
          {displayTags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <EditProfileSheet
        visible={editOpen}
        nickname={displayNickname}
        tagline={editableTagline}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />
    </section>
  )
}
