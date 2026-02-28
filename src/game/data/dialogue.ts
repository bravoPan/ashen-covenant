import type { DialogueTree } from './types'

export const DIALOGUES: Record<string, DialogueTree> = {
  npc_chief: {
    id: 'npc_chief',
    npcId: 'npc_chief',
    startNode: 'start',
    nodes: [
      {
        id: 'start',
        speaker: '村长陈德',
        text: '终于来了个猎人……你是从哪里来的？不管了，我们村子有麻烦。',
        options: [
          { text: '告诉我发生了什么。', next: 'explain' },
          { text: '先说报酬。', next: 'reward' },
          { text: '我只是路过。', next: 'pass' },
        ],
      },
      {
        id: 'explain',
        speaker: '村长陈德',
        text: '三天前开始，夜里就有东西袭击我们的牲畜。脚印看起来像狼，但比普通狼大得多。我们有老人和孩子，猎人们都不敢出村了。',
        options: [
          { text: '我来处理这件事。', next: 'accept', action: { type: 'start_quest', value: 'main_01' } },
          { text: '先说报酬。', next: 'reward' },
        ],
      },
      {
        id: 'reward',
        speaker: '村长陈德',
        text: '（叹气）村子穷，我能给的不多。80金币，外加我藏的一瓶药水。如果你能解决问题，我绝不会少你的。',
        options: [
          { text: '好，我接了。', next: 'accept', action: { type: 'start_quest', value: 'main_01' } },
          { text: '先看看情况。', next: 'end' },
        ],
      },
      {
        id: 'pass',
        speaker: '村长陈德',
        text: '（苦笑）路过……你知道上一个"路过"的猎人最后怎么样了吗？他现在就是村子南边坟地里的一座新碑。',
        options: [
          { text: '好吧，说说情况。', next: 'explain' },
          { text: '我要离开了。', next: 'end' },
        ],
      },
      {
        id: 'accept',
        speaker: '村长陈德',
        text: '谢天谢地。去森林西边看看，那里的山狼最多。小心点，听说最近森林里有些异常。',
        options: [{ text: '明白了。', next: 'end' }],
      },
      {
        id: 'quest_done',
        speaker: '村长陈德',
        text: '（如释重负）你做到了！昨晚终于没有袭击发生。这是说好的报酬，猎人，你救了我们村子。\n不过……我还有件事需要告诉你。关于这片森林里更深的秘密。',
        action: { type: 'complete_quest', value: 'main_01' },
        options: [
          { text: '什么秘密？', next: 'secret' },
          { text: '先拿报酬再说。', next: 'secret' },
        ],
      },
      {
        id: 'secret',
        speaker: '村长陈德',
        text: '我听说森林深处有个女巫的祭坛。老一辈说那是所有诅咒的根源。如果你能找到她……也许这片土地的厄运就能终结。',
        action: { type: 'start_quest', value: 'main_02' },
        options: [{ text: '我会查的。', next: 'end' }],
      },
      {
        id: 'end',
        speaker: '村长陈德',
        text: '保重，猎人。',
        options: [],
      },
    ],
  },

  npc_innkeeper: {
    id: 'npc_innkeeper',
    npcId: 'npc_innkeeper',
    startNode: 'start',
    nodes: [
      {
        id: 'start',
        speaker: '旅馆老板苏梦',
        text: '欢迎来到"渡鸦之巢"旅馆。需要些什么？',
        options: [
          { text: '我听说有个旅行者失踪了？', next: 'missing_person' },
          { text: '我想看看布告栏。', next: 'board', action: { type: 'open_board', value: 'inn_board' } },
          { text: '没什么，随便看看。', next: 'end' },
        ],
      },
      {
        id: 'missing_person',
        speaker: '旅馆老板苏梦',
        text: '（低声）是的，一个叫林峰的商人。三天前他说要去废墟方向看古董，结果再也没回来。他有个护身符……家传的，如果你能找到带回来，他家人一定会感激你的。',
        action: { type: 'start_quest', value: 'contract_02' },
        options: [
          { text: '我去找找。', next: 'end' },
          { text: '不是我的事。', next: 'end' },
        ],
      },
      {
        id: 'board',
        speaker: '旅馆老板苏梦',
        text: '布告栏在那边，自己看吧。',
        options: [{ text: '好的。', next: 'end' }],
      },
      {
        id: 'end',
        speaker: '旅馆老板苏梦',
        text: '需要帮忙就开口。',
        options: [],
      },
    ],
  },

  npc_merchant: {
    id: 'npc_merchant',
    npcId: 'npc_merchant',
    startNode: 'start',
    nodes: [
      {
        id: 'start',
        speaker: '商人赵强',
        text: '哟，猎人！正好，我这里有些好货。要看看吗？',
        options: [
          { text: '让我看看你有什么。', next: 'shop', action: { type: 'open_shop', value: 'merchant_shop' } },
          { text: '我有些东西想卖。', next: 'sell', action: { type: 'open_shop', value: 'merchant_shop' } },
          { text: '不用了，谢谢。', next: 'end' },
        ],
      },
      {
        id: 'shop',
        speaker: '商人赵强',
        text: '随便看，公道价格，童叟无欺！',
        options: [{ text: '好的。', next: 'end' }],
      },
      {
        id: 'sell',
        speaker: '商人赵强',
        text: '行，我收怪物材料、草药，什么都要。不过价格嘛……（搓手）你懂的。',
        options: [{ text: '打开吧。', next: 'end' }],
      },
      {
        id: 'end',
        speaker: '商人赵强',
        text: '有需要随时来！',
        options: [],
      },
    ],
  },

  npc_herbalist: {
    id: 'npc_herbalist',
    npcId: 'npc_herbalist',
    startNode: 'start',
    nodes: [
      {
        id: 'start',
        speaker: '草药师王芸',
        text: '（专注地研磨草药）啊，是猎人。我需要一些草药，村子里有人病了。你愿意帮忙吗？',
        options: [
          { text: '需要什么草药？', next: 'request', action: { type: 'start_quest', value: 'contract_04' } },
          { text: '能教我炼金术吗？', next: 'alchemy_hint' },
          { text: '现在没时间。', next: 'end' },
        ],
      },
      {
        id: 'request',
        speaker: '草药师王芸',
        text: '月光草和血浆果各五株。月光草在夜间采集最好，血浆果在森林里很常见。',
        options: [{ text: '我去找。', next: 'end' }],
      },
      {
        id: 'alchemy_hint',
        speaker: '草药师王芸',
        text: '打开背包里的炼金台就能调制药水。记住：不同材料组合产生不同效果。多试试，会有收获的。',
        options: [{ text: '明白了，谢谢。', next: 'end' }],
      },
      {
        id: 'end',
        speaker: '草药师王芸',
        text: '自然万物皆有其用。',
        options: [],
      },
    ],
  },

  npc_farmer: {
    id: 'npc_farmer',
    npcId: 'npc_farmer',
    startNode: 'start',
    nodes: [
      {
        id: 'start',
        speaker: '农场主李昂',
        text: '猎人……你看到布告栏上的委托了？那些溺亡者已经害得我损失惨重了！',
        options: [
          { text: '我来处理这件事。', next: 'accept', action: { type: 'start_quest', value: 'contract_01' } },
          { text: '那条小溪在哪里？', next: 'location' },
          { text: '不是我的事。', next: 'end' },
        ],
      },
      {
        id: 'location',
        speaker: '农场主李昂',
        text: '往森林方向走，看到那条弯曲的溪流就到了。夜里特别危险，但白天它们也不消停。',
        options: [
          { text: '我去看看。', next: 'accept', action: { type: 'start_quest', value: 'contract_01' } },
          { text: '知道了。', next: 'end' },
        ],
      },
      {
        id: 'accept',
        speaker: '农场主李昂',
        text: '谢谢你！消灭那些怪物后来找我，报酬少不了你的。',
        options: [{ text: '放心吧。', next: 'end' }],
      },
      {
        id: 'end',
        speaker: '农场主李昂',
        text: '……',
        options: [],
      },
    ],
  },

  npc_scholar: {
    id: 'npc_scholar',
    npcId: 'npc_scholar',
    startNode: 'start',
    nodes: [
      {
        id: 'start',
        speaker: '学者陈远',
        text: '（翻阅厚重的书本）哦，猎人。那个废墟里有我想要的古代铭文，但那些骷髅守卫让我没办法进去。',
        options: [
          { text: '我可以帮你清场。', next: 'accept', action: { type: 'start_quest', value: 'contract_05' } },
          { text: '废墟里有什么？', next: 'info' },
          { text: '找别人吧。', next: 'end' },
        ],
      },
      {
        id: 'info',
        speaker: '学者陈远',
        text: '那里曾是古代巫师的据点。据说他们留下了强大的魔法铭文，能揭示这片土地诅咒的真相……',
        options: [
          { text: '有意思。我帮你。', next: 'accept', action: { type: 'start_quest', value: 'contract_05' } },
          { text: '听起来很危险。', next: 'end' },
        ],
      },
      {
        id: 'accept',
        speaker: '学者陈远',
        text: '太感谢了！消灭入口处的骷髅兵后告诉我，我自带研究工具，不会添麻烦的。报酬200金币，另有一瓶珍贵药水。',
        options: [{ text: '好，等我消息。', next: 'end' }],
      },
      {
        id: 'end',
        speaker: '学者陈远',
        text: '历史不等人啊……',
        options: [],
      },
    ],
  },
}
