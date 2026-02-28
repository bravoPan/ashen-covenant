import type { BestiaryEntry } from './types'

export const BESTIARY: Record<string, BestiaryEntry> = {
  mountain_wolf: {
    id: 'mountain_wolf',
    name: '山狼',
    category: '野兽',
    description: '幽影村周边山区常见的大型野狼。在正常情况下不主动攻击人类，但受到魔力污染后会变得极具攻击性。',
    lore: '山狼本是这片土地上的原住民，与人类保持着微妙的平衡。老一辈猎人说，如果山狼开始攻击村庄，那一定意味着更深的黑暗在作怪。这次的山狼明显异于常态——眼神血红，泡沫横流，行动间散发着淡淡的诅咒气息。',
    weaknesses: ['银质武器', '火焰印（将其点燃可阻止群攻）'],
    resistances: ['钝器伤害减少'],
    tips: '山狼常常成群出现。优先消灭落单者，避免被包围。使用火焰印可有效驱散狼群。',
    unlocked: false,
  },
  drowner: {
    id: 'drowner',
    name: '溺亡者',
    category: '诅咒生物',
    description: '溺死者的亡魂聚集体，多出没于溪流、沼泽和积水地带。皮肤腐烂，散发恶臭，以锋利的爪子撕裂猎物。',
    lore: '溺亡者并非天生的怪物，而是那些在水中死去、无法安息的亡灵所变。传说每一具溺亡者都曾经是有血有肉的人，只是命运将他们推入了死水之中。村里老人说，向溺亡者扔硬币，是对其生前身份的悼念。',
    weaknesses: ['火焰印', '银质武器', '远离水源时战斗力下降'],
    resistances: ['寒冷效果无效', '物理伤害减少10%'],
    tips: '避免在水边与溺亡者交战，那会给它们提供优势。用火焰印点燃可大幅降低其战斗力。',
    unlocked: false,
  },
  forest_witch: {
    id: 'forest_witch',
    name: '野女巫',
    category: '魔法生物',
    description: '放逐于森林深处的邪恶女巫，掌握着古老的黑暗魔法。她们能召唤闪电和诅咒，也能操控野兽为己所用。',
    lore: '据说这片森林的野女巫曾经是一名学者，因为痴迷于禁忌魔法而被驱逐出城镇。在森林中流浪的岁月里，她被黑暗魔力彻底吞噬，成为了一头不人不鬼的存在。她恨透了所有人类。',
    weaknesses: ['冲击印（可打断其施法）', '银质武器', '近战压制'],
    resistances: ['法术伤害减少', '精神控制效果减弱'],
    tips: '在她施法前用冲击印打断，近身后连续攻击，不给她施法机会。注意闪避她的闪电球。',
    unlocked: false,
  },
  skeleton_soldier: {
    id: 'skeleton_soldier',
    name: '骷髅士兵',
    category: '亡灵',
    description: '被古老诅咒束缚于废墟中的亡灵士兵，穿着生前的铠甲，手持腐朽的武器，永无止境地守卫着已经不存在的主人。',
    lore: '这些骷髅兵曾是数百年前统治这片土地的古代王国的精锐卫队。当王国覆灭时，最后的巫师王将诅咒烙印在每一位士兵身上，让他们在死后继续效忠。如今的废墟就是他们的战场，也是他们的坟墓。',
    weaknesses: ['钢质武器（骨骼破碎）', '护盾印（弹反攻击）', '高爆伤害（炸弹）'],
    resistances: ['火焰伤害减少', '精神控制完全无效', '毒素无效'],
    tips: '保持距离，观察其攻击节奏后反击。护盾印弹反时机掌握好可造成双倍伤害。炸弹对密集的骷髅群效果显著。',
    unlocked: false,
  },
  forest_specter: {
    id: 'forest_specter',
    name: '森林幽灵',
    category: '幽灵',
    description: '死于非命的灵魂，无法离开它们死亡的地点，只能在黑暗中游荡，散发着令人窒息的绝望气息。触碰它们会感到刺骨的寒冷。',
    lore: '幽灵是所有亡灵中最令人同情的存在。它们没有选择成为怪物，只是因为某种执念——爱、恨、遗憾——将它们的灵魂留在了这个世界。这片森林里的幽灵，据说是战乱年代在此地战死却无人收埋的士兵。',
    weaknesses: ['幻惑印（临时解除其诅咒状态）', '月光剑油', '银质武器'],
    resistances: ['物理武器伤害减半（无涂油时）', '火焰无效'],
    tips: '使用月光剑油是对付幽灵最高效的方式。幻惑印可让其短暂静止，抓住机会连击。夜晚它们的力量会增强，白天交战更为有利。',
    unlocked: false,
  },
}

export interface AlchemyRecipeData {
  id: string
  name: string
  ingredients: Record<string, number>
  result: string
  resultQuantity: number
  description: string
}

export const ALCHEMY_RECIPES: Record<string, AlchemyRecipeData> = {
  healing_potion: {
    id: 'healing_potion',
    name: '猫眼药水',
    ingredients: { moonflower: 2, red_berry: 2 },
    result: 'healing_potion',
    resultQuantity: 1,
    description: '恢复大量生命值。月光草提供基础，血浆果激活其疗愈特性。',
  },
  stamina_potion: {
    id: 'stamina_potion',
    name: '雷鸟药水',
    ingredients: { swallow_feather: 2, magic_dust: 1 },
    result: 'stamina_potion',
    resultQuantity: 1,
    description: '快速恢复耐力。燕子羽毛蕴含速度魔力，与魔法粉尘结合效果持久。',
  },
  swallow_potion: {
    id: 'swallow_potion',
    name: '燕子药水',
    ingredients: { swallow_feather: 3, moonflower: 1, red_berry: 1 },
    result: 'swallow_potion',
    resultQuantity: 1,
    description: '持续恢复生命值，适合长时间战斗。',
  },
  tawny_owl: {
    id: 'tawny_owl',
    name: '茶棕猫头鹰',
    ingredients: { tawny_owl_feather: 3, magic_dust: 2 },
    result: 'tawny_owl',
    resultQuantity: 1,
    description: '快速恢复印记能量，让你能连续施放印记。',
  },
  beast_oil: {
    id: 'beast_oil',
    name: '野兽涂油',
    ingredients: { wolf_fang: 2, red_berry: 1 },
    result: 'beast_oil',
    resultQuantity: 2,
    description: '涂于剑刃，专门对付野兽类怪物。',
  },
  specter_oil: {
    id: 'specter_oil',
    name: '月光剑油',
    ingredients: { specter_dust: 2, moonflower: 2 },
    result: 'specter_oil',
    resultQuantity: 2,
    description: '对付幽灵类怪物的专用涂油。',
  },
  grapeshot_bomb: {
    id: 'grapeshot_bomb',
    name: '葡萄弹',
    ingredients: { iron_shavings: 2, sulfur: 1 },
    result: 'grapeshot_bomb',
    resultQuantity: 2,
    description: '爆炸范围广，适合对付密集的敌群。',
  },
  dancing_star: {
    id: 'dancing_star',
    name: '流星火雨',
    ingredients: { sulfur: 2, magic_dust: 1 },
    result: 'dancing_star',
    resultQuantity: 2,
    description: '产生燃烧碎片，可点燃敌人。',
  },
}
