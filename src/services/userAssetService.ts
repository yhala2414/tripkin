import type { BottleMessage } from '@/services/bottleService'
import { useUserAssetStore } from '@/store/useUserAssetStore'
import type {
  CompanionInvitation,
  SavedCompanionSnapshot,
  TripApplication,
} from '@/store/useUserAssetStore'
import type {
  PartnerMatchCardData,
  TripMatchCardData,
} from '@/pages/Match/types'

export type {
  CompanionInvitation,
  SavedCompanionSnapshot,
  TripApplication,
} from '@/store/useUserAssetStore'

function createAssetId(prefix: string, sourceId: string) {
  return `${prefix}-${sourceId}-${Date.now()}`
}

function getDateText(iso: string) {
  return iso.slice(0, 10)
}

function getCompanionEmoji(partner: PartnerMatchCardData) {
  return partner.persona?.emoji ?? '🤝'
}

export function recordCreatedBottle(bottle: BottleMessage) {
  useUserAssetStore.getState().addCreatedBottle(bottle)
}

export function getCreatedBottlesForDestination(destinationId: string) {
  return useUserAssetStore
    .getState()
    .createdBottles.filter((bottle) => bottle.spotId === destinationId)
}

export function toggleBottleLike(bottleId: string) {
  return useUserAssetStore.getState().toggleLikedBottle(bottleId)
}

export function toggleBottleCollect(bottle: BottleMessage) {
  return useUserAssetStore.getState().toggleSavedBottle(bottle)
}

export function toggleAuthorFollow(authorId: string) {
  return useUserAssetStore.getState().toggleFollowedAuthor(authorId)
}

export function createTripApplication(
  trip: TripMatchCardData,
  message: string,
): TripApplication {
  const createdAt = new Date().toISOString()
  const application: TripApplication = {
    id: createAssetId('trip-application', trip.id),
    tripId: trip.id,
    tripTitle: trip.title,
    destination: trip.location,
    message,
    status: 'pending',
    createdAt,
  }

  useUserAssetStore.getState().addTripApplication(application)

  return application
}

export function createCompanionInvitation(
  partner: PartnerMatchCardData,
  message?: string,
): CompanionInvitation {
  const createdAt = new Date().toISOString()
  const personaLabel =
    partner.persona?.tripkinTitleCn ?? partner.personality ?? '旅行搭子'
  const invitation: CompanionInvitation = {
    id: createAssetId('companion-invitation', partner.id),
    companionId: partner.id,
    companionName: partner.name,
    message,
    status: 'sent',
    createdAt,
    classicMbti: partner.classicMbti,
    personaLabel,
    tags: partner.interests.map((interest) => interest.label),
    travelStyle: partner.travelWay,
  }
  const companion: SavedCompanionSnapshot = {
    id: partner.id,
    avatarEmoji: getCompanionEmoji(partner),
    nickname: partner.name,
    mbti: partner.classicMbti,
    personalityLabel: personaLabel,
    tags: partner.interests.map((interest) => interest.label),
    travelStyle: partner.travelWay,
    collectedAt: getDateText(createdAt),
  }

  useUserAssetStore.getState().addCompanionInvitation(invitation, companion)

  return invitation
}
