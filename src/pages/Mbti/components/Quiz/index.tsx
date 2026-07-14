import { useEffect, useState } from 'react'
import { LeftOutline } from 'antd-mobile-icons'
import type { ChoiceLetter } from '@/types/mbti'
import { QUESTIONS } from '../../data'
import sharedStyles from '../shared.module.less'
import styles from './Quiz.module.less'

interface QuizProps {
  onComplete: (answers: ChoiceLetter[]) => void
  onBack?: () => void
}

const OPTION_LETTERS: ChoiceLetter[] = ['A', 'B']
const ANSWER_CACHE_KEY = 'tripkin_persona_answers_v1'

export function Quiz({ onComplete, onBack }: QuizProps) {
  const total = QUESTIONS.length
  const [answers, setAnswers] = useState<ChoiceLetter[]>(() => {
    try {
      const cached = window.localStorage.getItem(ANSWER_CACHE_KEY)
      const parsed = cached ? (JSON.parse(cached) as ChoiceLetter[]) : []
      return parsed
        .filter((item) => OPTION_LETTERS.includes(item))
        .slice(0, QUESTIONS.length)
    } catch {
      return []
    }
  })
  const [current, setCurrent] = useState(() =>
    Math.min(answers.length, QUESTIONS.length - 1),
  )
  const [selected, setSelected] = useState<ChoiceLetter | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const question = QUESTIONS[current]
  const canGoBack = current > 0 || onBack

  useEffect(() => {
    window.localStorage.setItem(ANSWER_CACHE_KEY, JSON.stringify(answers))
  }, [answers])

  const goBack = () => {
    if (selected || isCalculating) return
    if (current > 0) {
      setCurrent((c) => c - 1)
      setAnswers((a) => a.slice(0, -1))
      setSelected(null)
    } else if (onBack) {
      onBack()
    }
  }

  const choose = (letter: ChoiceLetter) => {
    if (selected || isCalculating) return
    setSelected(letter)
    const nextAnswers = [...answers, letter]
    window.setTimeout(() => {
      if (current < total - 1) {
        setAnswers(nextAnswers)
        setCurrent((c) => c + 1)
        setSelected(null)
      } else {
        setAnswers(nextAnswers)
        setIsCalculating(true)
        window.setTimeout(() => {
          window.localStorage.removeItem(ANSWER_CACHE_KEY)
          onComplete(nextAnswers)
        }, 520)
      }
    }, 360)
  }

  return (
    <div className={styles.quiz}>
      <div className={styles.progress}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={goBack}
          disabled={!canGoBack}
          aria-label="返回上一题"
        >
          <LeftOutline aria-hidden="true" />
        </button>
        <div className={styles.progressContent}>
          <div className={styles.bar}>
            <div
              className={styles.barFill}
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
          <div className={styles.meta}>
            <span className={styles.step}>
              {current + 1} / {total}
            </span>
            <div className={styles.dots}>
              {Array.from({ length: total }, (_, i) => (
                <span
                  key={i}
                  className={
                    i < current
                      ? styles.dotCompleted
                      : i === current
                        ? styles.dotOn
                        : styles.dot
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <article className={`${sharedStyles.glass} ${styles.card}`}>
        {isCalculating ? (
          <p className={styles.calculating}>正在生成旅行偏好画像...</p>
        ) : null}
        <p className={styles.qIndex}>
          Q.{String(current + 1).padStart(2, '0')}
        </p>
        <h2 className={styles.qTitle}>{question.title}</h2>
        <div className={styles.options}>
          {OPTION_LETTERS.map((letter) => (
            <button
              key={letter}
              type="button"
              className={`${styles.opt} ${selected === letter ? styles.optSelected : ''}`}
              onClick={() => choose(letter)}
              disabled={selected !== null}
            >
              <span className={styles.optBadge}>{letter}</span>
              <span className={styles.optText}>{question.options[letter]}</span>
            </button>
          ))}
        </div>
      </article>

      <p className={styles.tip}>
        {current > 0
          ? '点击选项自动进入下一题，或点击 ← 返回修改'
          : '点击选项自动进入下一题'}
      </p>
    </div>
  )
}
