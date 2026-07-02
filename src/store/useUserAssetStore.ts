import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BottleMessage } from '@/services/bottleService'

export interface TripApplication {
  id: string
  tripId: string
  tripTitle: string
  destination: string
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

export interface CompanionInvitation {
  id: string
  companionId: string
  companionName: string
  message?: string
  status: 'sent' | 'accepted' | 'declined'
  createdAt: string
  classicMbti?: string
  personaLabel?: string
  tags?: string[]
  travelStyle?: string
}

export interface SavedCompanionSnapshot {
  id: string
  avatarEmoji: string
  nickname: string
  mbti: string
  personalityLabel: string
  tags: string[]
  travelStyle: string
  collectedAt: string
}

export interface SavedDestinationSnapshot {
  id: string
  cityName: string
  coverEmoji: string
  reason: string
  collectedAt: string
}

interface UserAssetStore {
  createdBottles: BottleMessage[]
  savedBottleIds: string[]
  savedBottleSnapshots: BottleMessage[]
  likedBottleIds: string[]
  followedAuthorIds: string[]
  tripApplications: TripApplication[]
  companionInvitations: CompanionInvitation[]
  savedCompanionIds: string[]
  savedCompanionSnapshots: SavedCompanionSnapshot[]
  savedDestinationIds: string[]
  savedDestinationSnapshots: SavedDestinationSnapshot[]
  addCreatedBottle: (bottle: BottleMessage) => void
  toggleSavedBottle: (bottle: BottleMessage) => boolean
  toggleLikedBottle: (bottleId: string) => boolean
  toggleFollowedAuthor: (authorId: string) => boolean
  addTripApplication: (application: TripApplication) => void
  addCompanionInvitation: (
    invitation: CompanionInvitation,
    companion?: SavedCompanionSnapshot,
  ) => void
}

function addUnique<T extends { id: string }>(items: T[], item: T) {
  return [item, ...items.filter((current) => current.id !== item.id)]
}

function toggleId(ids: string[], id: string) {
  return ids.includes(id)
    ? { ids: ids.filter((current) => current !== id), active: false }
    : { ids: [id, ...ids], active: true }
}

const initialAssets = {
  createdBottles: [],
  savedBottleIds: [],
  savedBottleSnapshots: [],
  likedBottleIds: [],
  followedAuthorIds: [],
  tripApplications: [],
  companionInvitations: [],
  savedCompanionIds: [],
  savedCompanionSnapshots: [],
  savedDestinationIds: [],
  savedDestinationSnapshots: [],
}

export const useUserAssetStore = create<UserAssetStore>()(
  persist(
    (set) => ({
      ...initialAssets,
      addCreatedBottle: (bottle) =>
        set((state) => ({
          createdBottles: addUnique(state.createdBottles, bottle),
          followedAuthorIds: state.followedAuthorIds.includes(bottle.authorId)
            ? state.followedAuthorIds
            : [bottle.authorId, ...state.followedAuthorIds],
        })),
      toggleSavedBottle: (bottle) => {
        let nextActive = false

        set((state) => {
          const next = toggleId(state.savedBottleIds, bottle.id)
          nextActive = next.active

          return {
            savedBottleIds: next.ids,
            savedBottleSnapshots: next.active
              ? addUnique(state.savedBottleSnapshots, bottle)
              : state.savedBottleSnapshots.filter(
                  (current) => current.id !== bottle.id,
                ),
          }
        })

        return nextActive
      },
      toggleLikedBottle: (bottleId) => {
        let nextActive = false

        set((state) => {
          const next = toggleId(state.likedBottleIds, bottleId)
          nextActive = next.active

          return { likedBottleIds: next.ids }
        })

        return nextActive
      },
      toggleFollowedAuthor: (authorId) => {
        let nextActive = false

        set((state) => {
          const next = toggleId(state.followedAuthorIds, authorId)
          nextActive = next.active

          return { followedAuthorIds: next.ids }
        })

        return nextActive
      },
      addTripApplication: (application) =>
        set((state) => ({
          tripApplications: addUnique(state.tripApplications, application),
        })),
      addCompanionInvitation: (invitation, companion) =>
        set((state) => ({
          companionInvitations: addUnique(
            state.companionInvitations,
            invitation,
          ),
          savedCompanionIds: state.savedCompanionIds.includes(
            invitation.companionId,
          )
            ? state.savedCompanionIds
            : [invitation.companionId, ...state.savedCompanionIds],
          savedCompanionSnapshots: companion
            ? addUnique(state.savedCompanionSnapshots, companion)
            : state.savedCompanionSnapshots,
        })),
    }),
    {
      name: 'tripkin-user-assets-v1',
      partialize: (state) => ({
        createdBottles: state.createdBottles,
        savedBottleIds: state.savedBottleIds,
        savedBottleSnapshots: state.savedBottleSnapshots,
        likedBottleIds: state.likedBottleIds,
        followedAuthorIds: state.followedAuthorIds,
        tripApplications: state.tripApplications,
        companionInvitations: state.companionInvitations,
        savedCompanionIds: state.savedCompanionIds,
        savedCompanionSnapshots: state.savedCompanionSnapshots,
        savedDestinationIds: state.savedDestinationIds,
        savedDestinationSnapshots: state.savedDestinationSnapshots,
      }),
    },
  ),
)
