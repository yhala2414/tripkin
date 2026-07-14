import type { CSSProperties } from 'react'
import { Toast } from 'antd-mobile'
import { LeftOutline, SendOutline } from 'antd-mobile-icons'
import type { PersonaId } from '@/types/mbti'
import { PERSONALITIES } from '../../data'
import { getPersonaPresentation } from '@/utils/personaPresentation'
import { PersonaAvatar } from '../PersonaAvatar'
import sharedStyles from '../shared.module.less'
import styles from './IdentityCard.module.less'

/** 3 字以内的通俗短名称 */
const SHORT_NAMES: Record<PersonaId, string> = {
  'Cyber-Raider': '特种兵',
  'Zen-Capybara': '佛系派',
  'Budget-Architect': '精算家',
  'Romantic-Observer': '浪漫派',
}

/** 与你最相配的旅行关键词 */
const MATCH_KEYWORDS: Record<PersonaId, string[]> = {
  'Cyber-Raider': ['极限挑战', '高效打卡', '热血冲刺', '战绩收藏'],
  'Zen-Capybara': ['松弛疗愈', '慢节奏', '自然沉浸', '发呆时光'],
  'Budget-Architect': ['深度溯源', '精打细算', '文化探秘', '路线规划'],
  'Romantic-Observer': ['自由探索', '氛围感', '故事感', '即兴惊喜'],
}

interface IdentityCardProps {
  personaId: PersonaId
  onBack: () => void
}

export function IdentityCard({ personaId, onBack }: IdentityCardProps) {
  const persona = PERSONALITIES[personaId]
  const { classicMbti } = getPersonaPresentation(personaId)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      Toast.show({ content: '链接已复制，快去分享给旅伴吧' })
    } catch {
      Toast.show({ content: '复制失败，请手动复制地址栏链接' })
    }
  }

  return (
    <div
      className={styles.result}
      style={{ '--accent': persona.accent } as CSSProperties}
    >
      {/* 顶部导航 */}
      <div className={styles.topNav}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={onBack}
          aria-label="返回"
        >
          <LeftOutline aria-hidden="true" />
        </button>
        <span className={styles.topTitle}>你的旅行MBTI是</span>
        <button
          type="button"
          className={styles.shareBtn}
          onClick={handleShare}
          aria-label="分享旅行 MBTI 结果"
        >
          <SendOutline aria-hidden="true" />
          分享
        </button>
      </div>

      {/* 身份卡片：左头像 + 右信息 */}
      <div className={styles.idCard}>
        <div className={styles.idCardAvatar}>
          <PersonaAvatar id={personaId} />
        </div>
        <div className={styles.idCardInfo}>
          <h1 className={styles.mbtiType}>{classicMbti}</h1>
          <p className={styles.personaName}>{persona.titleCn}</p>
          <span className={styles.personaBadge}>{SHORT_NAMES[personaId]}</span>
        </div>
      </div>

      {/* 人格标签 */}
      <div className={styles.tagsRow}>
        {persona.tags.map((t) => (
          <span key={t} className={styles.tag}>
            {t}
          </span>
        ))}
      </div>

      {/* 人格详细介绍 */}
      <p className={styles.description}>{persona.description}</p>

      {/* 与你最相配的旅行关键词 */}
      <div className={styles.matchSection}>
        <p className={styles.matchTitle}>与你最相配的旅行关键词</p>
        <div className={styles.matchTags}>
          {MATCH_KEYWORDS[personaId].map((kw) => (
            <span key={kw} className={styles.matchTag}>
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* 底部按钮 */}
      <footer className={styles.resultFooter}>
        <button
          type="button"
          className={`${sharedStyles.btn} ${sharedStyles.btnPrimary} ${sharedStyles.btnLg}`}
          onClick={handleShare}
        >
          <SendOutline aria-hidden="true" />
          <span>分享我的结果</span>
        </button>
      </footer>
    </div>
  )
}
