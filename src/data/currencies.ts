import type { Currency } from '../types'

const CG = 'https://assets.coingecko.com/coins/images'

/* Мок-список валют (бэкенд подключим позже): 14 крипто + 2 фиата.
   Логотипы — CoinGecko-ассеты; glyph — символьный фолбэк. */
export const CURRENCIES: Currency[] = [
  {
    ticker: 'USDT',
    name: 'Tether',
    kind: 'crypto',
    networks: ['TRC20', 'ERC20', 'BEP20', 'TON', 'SOL', 'Polygon'],
    logo: `${CG}/325/small/Tether.png`,
    glyph: '₮',
  },
  {
    ticker: 'USDC',
    name: 'USD Coin',
    kind: 'crypto',
    networks: ['ERC20', 'BEP20', 'SOL', 'Polygon'],
    logo: `${CG}/6319/small/usdc.png`,
    glyph: '$',
  },
  { ticker: 'BTC', name: 'Bitcoin', kind: 'crypto', networks: ['BTC'], logo: `${CG}/1/small/bitcoin.png`, glyph: '₿' },
  { ticker: 'ETH', name: 'Ethereum', kind: 'crypto', networks: ['ERC20'], logo: `${CG}/279/small/ethereum.png`, glyph: 'Ξ' },
  { ticker: 'SOL', name: 'Solana', kind: 'crypto', networks: ['SOL'], logo: `${CG}/4128/small/solana.png`, glyph: '◎' },
  { ticker: 'TON', name: 'Toncoin', kind: 'crypto', networks: ['TON'], logo: `${CG}/17980/small/ton_symbol.png`, glyph: '◈' },
  { ticker: 'TRX', name: 'Tron', kind: 'crypto', networks: ['TRC20'], logo: `${CG}/1094/small/tron-logo.png`, glyph: '✕' },
  { ticker: 'XRP', name: 'Ripple', kind: 'crypto', networks: ['XRP'], logo: `${CG}/44/small/xrp-symbol-white-128.png`, glyph: '✕' },
  { ticker: 'BNB', name: 'BNB', kind: 'crypto', networks: ['BEP20'], logo: `${CG}/825/small/bnb-icon2_2x.png`, glyph: 'Ƀ' },
  { ticker: 'ADA', name: 'Cardano', kind: 'crypto', networks: ['ADA'], logo: `${CG}/975/small/cardano.png`, glyph: '₳' },
  { ticker: 'MATIC', name: 'Polygon', kind: 'crypto', networks: ['Polygon'], logo: `${CG}/4713/small/polygon.png`, glyph: '⬡' },
  { ticker: 'LTC', name: 'Litecoin', kind: 'crypto', networks: ['LTC'], logo: `${CG}/2/small/litecoin.png`, glyph: 'Ł' },
  { ticker: 'DAI', name: 'Dai', kind: 'crypto', networks: ['ERC20'], logo: `${CG}/9956/small/Badge_Dai.png`, glyph: '◈' },
  { ticker: 'XLM', name: 'Stellar', kind: 'crypto', networks: ['XLM'], logo: `${CG}/100/small/Stellar_symbol_black_RGB.png`, glyph: '✦' },

  { ticker: 'GEL', name: 'Georgian Lari', kind: 'fiat', networks: ['Cash'], glyph: '₾' },
  { ticker: 'USD', name: 'US Dollar', kind: 'fiat', networks: ['Cash', 'Card'], glyph: '$' },
]

export const CURRENCY_MAP: Record<string, Currency> = Object.fromEntries(
  CURRENCIES.map((c) => [c.ticker, c]),
)

export function getCurrency(ticker: string): Currency | undefined {
  return CURRENCY_MAP[ticker]
}

/** Быстрые чипы FROM/TO в зависимости от типа */
export const QUICK_CRYPTO = ['USDT', 'BTC', 'ETH', 'TON', 'SOL']
export const QUICK_FIAT = ['USD', 'GEL']
