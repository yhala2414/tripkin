import { useState } from 'react'
import type { MockCollectionStats } from '../../mock'
import { FavoriteDestinationsPage } from '../FavoriteDestinationsPage'
import { FavoriteBottlesPage } from '../FavoriteBottlesPage'
import { FavoriteCompanionsPage } from '../FavoriteCompanionsPage'
import {
  type MockFavoriteBottle,
  type MockFavoriteCompanion,
  type MockFavoriteDestination,
} from '../../mockFavorites'
import styles from './CollectionSection.module.less'

interface CollectionSectionProps {
  collectionStats: MockCollectionStats
  destinationItems?: MockFavoriteDestination[]
  bottleItems?: MockFavoriteBottle[]
  companionItems?: MockFavoriteCompanion[]
}

const PAGE_MAP: Record<string, string> = {
  目的地: 'destinations',
  漂流瓶: 'bottles',
  搭子: 'companions',
}

export function CollectionSection({
  collectionStats,
  destinationItems = [],
  bottleItems = [],
  companionItems = [],
}: CollectionSectionProps) {
  const [openPage, setOpenPage] = useState<string | null>(null)

  const handleClick = (label: string) => {
    const key = PAGE_MAP[label]
    if (key) setOpenPage(key)
  }

  const cards = [
    { icon: '🗺️', value: collectionStats.destinations, label: '目的地' },
    { icon: '🌊', value: collectionStats.bottles, label: '漂流瓶' },
    { icon: '🤝', value: collectionStats.companions, label: '搭子' },
  ]

  return (
    <section className={styles.section}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📁</span>
          我的收藏
        </h2>
      </header>

      <div className={styles.grid}>
        {cards.map((c) => (
          <div
            key={c.label}
            className={styles.card}
            onClick={() => handleClick(c.label)}
          >
            <span className={styles.cardIcon}>{c.icon}</span>
            <strong className={styles.cardValue}>{c.value}</strong>
            <span className={styles.cardLabel}>{c.label}</span>
          </div>
        ))}
      </div>

      <FavoriteDestinationsPage
        visible={openPage === 'destinations'}
        items={destinationItems}
        onClose={() => setOpenPage(null)}
      />
      <FavoriteBottlesPage
        visible={openPage === 'bottles'}
        items={bottleItems}
        onClose={() => setOpenPage(null)}
      />
      <FavoriteCompanionsPage
        visible={openPage === 'companions'}
        items={companionItems}
        onClose={() => setOpenPage(null)}
      />
    </section>
  )
}
