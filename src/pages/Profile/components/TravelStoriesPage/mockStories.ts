export interface MockStory {
  id: number | string
  city: string
  title: string
  summary: string
  publishDate: string
  replyCount: number
  favoriteCount: number
  category: 'mine' | 'reply' | 'featured'
}

export const MOCK_STORIES: MockStory[] = [
  {
    id: 1,
    city: '稻城亚丁',
    title: '在稻城亚丁捡到的一封信',
    summary:
      '那天下午，我在冲古寺的石阶上发现了一个泛黄的信封。里面是一张手绘的雪山地图，标注着一条从未听说过的小路...',
    publishDate: '2026-06-18',
    replyCount: 3,
    favoriteCount: 5,
    category: 'featured',
  },
  {
    id: 2,
    city: '大理',
    title: '大理的云知道答案',
    summary:
      '洱海边的老奶奶说，这里的每一朵云都有自己的名字。我花了三天时间，记录下十二朵不同形状的云...',
    publishDate: '2026-06-15',
    replyCount: 2,
    favoriteCount: 4,
    category: 'featured',
  },
  {
    id: 3,
    city: '四姑娘山',
    title: '海拔四千米的星空',
    summary:
      '凌晨三点，帐篷外的温度降到了零下。我拉开拉链的瞬间，看见了此生最密集的银河。那一刻觉得所有疲惫都值得...',
    publishDate: '2026-06-12',
    replyCount: 5,
    favoriteCount: 7,
    category: 'mine',
  },
  {
    id: 4,
    city: '新都桥',
    title: '光影长廊的日落',
    summary:
      '摄影师的天堂不是白叫的。下午六点半，阳光穿过杨树林，在地上画出金黄色的条纹。我坐在路边看了整整一小时...',
    publishDate: '2026-06-10',
    replyCount: 4,
    favoriteCount: 6,
    category: 'mine',
  },
  {
    id: 5,
    city: '理塘',
    title: '世界高城的清晨',
    summary:
      '理塘的清晨从转经筒的声音开始。我跟着一位藏族阿妈绕寺庙走了三圈，她说每一步都是祝福...',
    publishDate: '2026-06-08',
    replyCount: 1,
    favoriteCount: 3,
    category: 'mine',
  },
  {
    id: 6,
    city: '康定',
    title: '情歌故里的雨夜',
    summary:
      '跑马山上下起了小雨，我在一家藏式茶馆躲雨。老板放起了《康定情歌》，几个陌生人跟着哼了起来。那个夜晚温暖得不像话...',
    publishDate: '2026-06-05',
    replyCount: 6,
    favoriteCount: 8,
    category: 'reply',
  },
  {
    id: 7,
    city: '稻城亚丁',
    title: '牛奶海的传说',
    summary:
      '当地人说牛奶海是神山流下的一滴眼泪。爬上4600米后看到的景色，让我相信了这个传说。湖水蓝得不真实...',
    publishDate: '2026-06-02',
    replyCount: 2,
    favoriteCount: 4,
    category: 'reply',
  },
  {
    id: 8,
    city: '大理',
    title: '古城里的深夜食堂',
    summary:
      '午夜的人民路，一家只有四张桌子的小馆子还在营业。老板是个退休的厨师，每道菜都配一个故事...',
    publishDate: '2026-05-28',
    replyCount: 3,
    favoriteCount: 5,
    category: 'mine',
  },
  {
    id: 9,
    city: '新都桥',
    title: '搭车去塔公草原',
    summary:
      '在新都桥拦了一辆去塔公的皮卡。司机是个藏族大叔，一路给我讲格萨尔王的故事。语言不太通，但笑容足够...',
    publishDate: '2026-05-25',
    replyCount: 7,
    favoriteCount: 9,
    category: 'reply',
  },
  {
    id: 10,
    city: '四姑娘山',
    title: '幺妹峰的日出',
    summary:
      '凌晨四点半出发，打着手电走了两个小时。当第一缕阳光照在幺妹峰顶上时，所有人都安静了。那种美不需要语言...',
    publishDate: '2026-05-20',
    replyCount: 4,
    favoriteCount: 6,
    category: 'mine',
  },
]
