import type { QuestData } from './types'

export const QUESTS: Record<string, QuestData> = {
  // 主线任务
  main_01: {
    id: 'main_01',
    title: '不祥的村庄',
    description: '幽影村的村民们神情惶恐——夜里有东西在袭击牲畜。村长请求你调查此事。',
    type: 'main',
    stages: [
      {
        id: 'talk_to_chief',
        description: '与村长对话，了解情况',
        objective: { type: 'talk', target: 'npc_chief', count: 1 },
      },
      {
        id: 'kill_wolves',
        description: '消灭袭击牲畜的山狼（0/3）',
        objective: { type: 'kill', target: 'mountain_wolf', count: 3, zoneId: 'zone_forest' },
      },
      {
        id: 'report_back',
        description: '向村长汇报结果',
        objective: { type: 'talk', target: 'npc_chief', count: 1 },
      },
    ],
    rewards: { xp: 150, gold: 80, items: ['healing_potion'] },
  },
  main_02: {
    id: 'main_02',
    title: '迷雾中的秘密',
    description: '村长透露，森林深处有一个神秘的女巫，可能是诅咒的幕后黑手。你需要找到她并解除诅咒。',
    type: 'main',
    stages: [
      {
        id: 'find_altar',
        description: '在迷雾森林中找到女巫的祭坛',
        objective: { type: 'reach', target: 'witch_altar', count: 1, zoneId: 'zone_forest' },
      },
      {
        id: 'kill_witch',
        description: '消灭野女巫',
        objective: { type: 'kill', target: 'forest_witch', count: 1, zoneId: 'zone_forest' },
      },
      {
        id: 'get_stone',
        description: '取得诅咒之石',
        objective: { type: 'collect', target: 'cursed_stone', count: 1 },
      },
    ],
    rewards: { xp: 300, gold: 150, items: ['silver_sword'] },
  },
  main_03: {
    id: 'main_03',
    title: '腐朽废墟的真相',
    description: '诅咒之石指引你前往东边的古代废墟——那里埋藏着这片土地诅咒的根源。',
    type: 'main',
    stages: [
      {
        id: 'reach_ruins',
        description: '前往腐朽废墟',
        objective: { type: 'reach', target: 'zone_ruins', count: 1, zoneId: 'zone_ruins' },
      },
      {
        id: 'kill_skeletons',
        description: '消灭看守废墟的骷髅士兵（0/5）',
        objective: { type: 'kill', target: 'skeleton_soldier', count: 5, zoneId: 'zone_ruins' },
      },
      {
        id: 'destroy_source',
        description: '摧毁诅咒之源',
        objective: { type: 'reach', target: 'curse_source', count: 1, zoneId: 'zone_ruins' },
      },
    ],
    rewards: { xp: 500, gold: 250, items: ['chain_armor'] },
  },

  // 支线委托
  contract_01: {
    id: 'contract_01',
    title: '委托：农场的威胁',
    description: '幽影村农场主李昂请求：过去三天，溺亡者袭击了他靠近溪流的农场，已损失数头牲畜。需要猎人解决这个问题。\n\n赏金：120金币',
    type: 'contract',
    stages: [
      {
        id: 'kill_drowners',
        description: '消灭靠近农场的溺亡者（0/3）',
        objective: { type: 'kill', target: 'drowner', count: 3, zoneId: 'zone_forest' },
      },
      {
        id: 'report_farmer',
        description: '向农场主汇报',
        objective: { type: 'talk', target: 'npc_farmer', count: 1 },
      },
    ],
    rewards: { xp: 100, gold: 120 },
  },
  contract_02: {
    id: 'contract_02',
    title: '委托：失踪的旅行者',
    description: '旅馆老板苏梦说一名旅行者在前往废墟途中失踪，已三日未归。请查明下落并带回其遗物。\n\n赏金：100金币',
    type: 'contract',
    stages: [
      {
        id: 'find_amulet',
        description: '在迷雾森林中寻找旅行者的遗物',
        objective: { type: 'collect', target: 'missing_amulet', count: 1 },
      },
      {
        id: 'return_amulet',
        description: '将护身符交还给旅馆老板',
        objective: { type: 'deliver', target: 'npc_innkeeper', count: 1 },
      },
    ],
    rewards: { xp: 80, gold: 100, items: ['healing_potion'] },
  },
  contract_03: {
    id: 'contract_03',
    title: '委托：夜间的哭泣',
    description: '村民们反映每到夜晚便听到来自森林的哭泣声，疑似是幽灵作祟，已有两人因此精神崩溃。\n\n赏金：160金币',
    type: 'contract',
    stages: [
      {
        id: 'kill_specters',
        description: '消灭森林中的幽灵（0/2）',
        objective: { type: 'kill', target: 'forest_specter', count: 2, zoneId: 'zone_forest' },
      },
      {
        id: 'report_village',
        description: '向村长汇报',
        objective: { type: 'talk', target: 'npc_chief', count: 1 },
      },
    ],
    rewards: { xp: 130, gold: 160 },
  },
  contract_04: {
    id: 'contract_04',
    title: '委托：收集草药',
    description: '草药师王芸需要月光草和血浆果来配制药水，以应对村中正在蔓延的疾病。\n\n赏金：60金币',
    type: 'contract',
    stages: [
      {
        id: 'collect_moonflower',
        description: '收集月光草（0/5）',
        objective: { type: 'collect', target: 'moonflower', count: 5 },
      },
      {
        id: 'collect_redberry',
        description: '收集血浆果（0/5）',
        objective: { type: 'collect', target: 'red_berry', count: 5 },
      },
      {
        id: 'deliver_herbs',
        description: '将草药交给草药师',
        objective: { type: 'deliver', target: 'npc_herbalist', count: 1 },
      },
    ],
    rewards: { xp: 60, gold: 60, items: ['swallow_potion'] },
  },
  contract_05: {
    id: 'contract_05',
    title: '委托：废墟守卫',
    description: '学者陈远想要进入废墟研究古代铭文，但骷髅士兵阻挡了去路。需要猎人清场。\n\n赏金：200金币',
    type: 'contract',
    stages: [
      {
        id: 'kill_skeletons',
        description: '消灭废墟入口的骷髅士兵（0/4）',
        objective: { type: 'kill', target: 'skeleton_soldier', count: 4, zoneId: 'zone_ruins' },
      },
      {
        id: 'escort_scholar',
        description: '向学者汇报，护送他到废墟',
        objective: { type: 'talk', target: 'npc_scholar', count: 1 },
      },
    ],
    rewards: { xp: 180, gold: 200, items: ['tawny_owl'] },
  },
}
