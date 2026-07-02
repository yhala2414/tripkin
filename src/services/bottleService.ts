import {
  bottleTypeOptions,
  defaultBottleImage,
  getBottleListByDest,
  type BottleListResult,
  type BottleMessage,
  type BottleType,
  type BottleVisibilityType,
  typeLabels,
  visibilityLabels,
} from '@/pages/Bottle/data/bottleMockData'
import {
  getCreatedBottlesForDestination,
  recordCreatedBottle,
} from '@/services/userAssetService'

export { bottleTypeOptions, defaultBottleImage, typeLabels, visibilityLabels }
export type { BottleMessage, BottleType, BottleVisibilityType }

export type BottleServiceListSource = 'direct' | 'parent' | 'fallback'

export interface BottleServiceListResult extends Omit<
  BottleListResult,
  'source'
> {
  source: BottleServiceListSource
}

export interface GetBottleListForDestinationOptions {
  destId: string
  destName: string
  parentId?: string
  parentName?: string
}

export interface CreateBottleMessageOptions {
  destId: string
  destName: string
  parentId?: string
  type: BottleType
  bottleType?: BottleVisibilityType
  content: string
}

type LegacyBottleType = 'story' | 'partner'

type BottleApiMessage = Partial<Omit<BottleMessage, 'type'>> & {
  id: string
  type: BottleType | LegacyBottleType
  content: string
  tags?: string[]
  from?: string
  createdAt?: string
  imageUrl?: string
  destinationName?: string
}

type BottleApiListResult = Omit<BottleListResult, 'items'> & {
  items: BottleApiMessage[]
}

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL?.trim() ?? ''
}

function buildApiUrl(path: string) {
  return `${getApiBaseUrl().replace(/\/+$/, '')}${path}`
}

async function requestBottleApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(buildApiUrl(path), init)

  if (!response.ok) {
    let errorMessage = `Bottle API 请求失败：${response.status}`

    try {
      const payload = (await response.json()) as {
        error?: {
          message?: string
        }
      }

      errorMessage = payload.error?.message ?? errorMessage
    } catch {
      // Ignore JSON parse failures and keep the fallback message.
    }

    throw new Error(errorMessage)
  }

  return (await response.json()) as T
}

function adaptBottleType(type: BottleType | LegacyBottleType): BottleType {
  if (type === 'story') {
    return 'memory'
  }

  if (type === 'partner') {
    return 'companion'
  }

  return type
}

function normalizeBottleMessage(
  bottle: BottleApiMessage,
  options: {
    destId: string
    destName: string
    parentId?: string
  },
): BottleMessage {
  const type = adaptBottleType(bottle.type)
  const tags = bottle.tags ?? [typeLabels[type], options.destName]
  const authorName =
    bottle.authorName ?? bottle.from ?? '\u533f\u540d\u65c5\u4eba'
  const publishTime = bottle.publishTime ?? new Date().toISOString()
  const publishTimeText =
    bottle.publishTimeText ?? bottle.createdAt ?? '\u521a\u521a'
  const images =
    bottle.images && bottle.images.length > 0
      ? bottle.images
      : [bottle.imageUrl ?? defaultBottleImage]
  const content = bottle.content

  return {
    id: bottle.id,
    spotId: bottle.spotId ?? options.destId,
    regionId: bottle.regionId ?? options.parentId ?? options.destId,
    title: bottle.title ?? `${authorName}\u7684${typeLabels[type]}\u74f6`,
    content,
    summary:
      bottle.summary ??
      (content.length > 42 ? `${content.slice(0, 42)}...` : content),
    type,
    bottleType: bottle.bottleType ?? 'normal',
    authorId: bottle.authorId ?? bottle.id,
    authorName,
    authorAvatar:
      bottle.authorAvatar ??
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        bottle.id,
      )}`,
    authorPersona: bottle.authorPersona ?? '\u65c5\u884c\u8bb0\u5f55\u8005',
    authorCity: bottle.authorCity ?? '\u672a\u77e5\u57ce\u5e02',
    destinationName: bottle.destinationName ?? options.destName,
    images,
    tags,
    likes: bottle.likes ?? 0,
    comments: bottle.comments ?? 0,
    isLiked: bottle.isLiked ?? false,
    isCollected: bottle.isCollected ?? false,
    isFollowing: bottle.isFollowing ?? false,
    publishTime,
    publishTimeText,
  }
}

function adaptBottleListResult(
  result: BottleApiListResult,
  options: GetBottleListForDestinationOptions,
): BottleServiceListResult {
  return {
    ...result,
    source: result.source === 'exact' ? 'direct' : result.source,
    items: result.items.map((item) => normalizeBottleMessage(item, options)),
  }
}

function createLocalBottle({
  destId,
  destName,
  parentId,
  type,
  bottleType = 'normal',
  content,
}: CreateBottleMessageOptions): BottleMessage {
  const now = new Date()
  const typeLabel = typeLabels[type]
  const newBottle: BottleMessage = {
    id: `user-${destId}-${Date.now()}`,
    spotId: destId,
    regionId: parentId ?? destId,
    title: `\u6211\u5728${destName}\u6295\u51fa\u7684\u6f02\u6d41\u74f6`,
    type,
    bottleType,
    content,
    summary: content.length > 42 ? `${content.slice(0, 42)}...` : content,
    authorId: 'current-user',
    authorName: '\u6211\u6295\u51fa\u7684\u74f6\u5b50',
    authorAvatar:
      'https://api.dicebear.com/7.x/avataaars/svg?seed=tripkin-current-user',
    authorPersona: '\u65c5\u884c\u6d4b\u8bd5\u7528\u6237',
    authorCity: '\u5f53\u524d\u57ce\u5e02',
    destinationName: destName,
    images: [defaultBottleImage],
    tags: [
      typeLabel,
      destName,
      visibilityLabels[bottleType],
      '\u521a\u6295\u51fa',
    ],
    likes: 0,
    comments: 0,
    isLiked: false,
    isCollected: false,
    isFollowing: true,
    publishTime: now.toISOString(),
    publishTimeText: '\u521a\u521a',
  }

  return newBottle
}

export async function getBottleListForDestination(
  options: GetBottleListForDestinationOptions,
): Promise<BottleServiceListResult> {
  if (!getApiBaseUrl()) {
    const result = getBottleListByDest(options)
    const adaptedResult = adaptBottleListResult(result, options)

    return {
      ...adaptedResult,
      items: [
        ...getCreatedBottlesForDestination(options.destId),
        ...adaptedResult.items,
      ],
    }
  }

  const result = await requestBottleApi<BottleApiListResult>(
    `/api/bottles?destinationId=${encodeURIComponent(options.destId)}`,
  )

  return adaptBottleListResult(result, options)
}

export async function createBottleMessage(
  options: CreateBottleMessageOptions,
): Promise<BottleMessage> {
  if (!getApiBaseUrl()) {
    const newBottle = createLocalBottle(options)
    recordCreatedBottle(newBottle)

    return newBottle
  }

  const createdBottle = await requestBottleApi<BottleApiMessage>(
    '/api/bottles',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destinationId: options.destId,
        type: options.type,
        content: options.content,
      }),
    },
  )

  const normalizedBottle = normalizeBottleMessage(createdBottle, options)
  recordCreatedBottle(normalizedBottle)

  return normalizedBottle
}
