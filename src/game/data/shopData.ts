import type { ShopItem } from './types'

export const SHOP_INVENTORIES: Record<string, ShopItem[]> = {
  merchant_shop: [
    { itemId: 'healing_potion', quantity: 5, price: 80 },
    { itemId: 'stamina_potion', quantity: 3, price: 65 },
    { itemId: 'beast_oil', quantity: 3, price: 55 },
    { itemId: 'silver_sword', quantity: 1, price: 350 },
    { itemId: 'chain_armor', quantity: 1, price: 300 },
    { itemId: 'grapeshot_bomb', quantity: 5, price: 40 },
    { itemId: 'moonflower', quantity: 10, price: 12 },
    { itemId: 'red_berry', quantity: 10, price: 10 },
    { itemId: 'sulfur', quantity: 5, price: 18 },
    { itemId: 'iron_shavings', quantity: 5, price: 12 },
  ],
}
