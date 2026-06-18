/* Модель комиссий (МОК — backend заменит реальными значениями).
   Seam для бэкенда: значения должны прийти из API /quote вместе с курсом.
   AllTrust позиционируется как «0% сервисной комиссии, курс уже финальный»,
   но сетевой сбор за вывод крипты реально существует — показываем честно. */

/** Сервисная комиссия, % от суммы. 0 = включена в курс (маркетинговый USP). */
export const SERVICE_FEE_PCT = 0

/** Сетевой сбор за вывод крипты, в USD-эквиваленте, по сети.
   Берётся только когда пользователь ПОЛУЧАЕТ криптовалюту on-chain. */
export const NETWORK_FEE_USD: Record<string, number> = {
  TRC20: 1,
  ERC20: 4.5,
  BEP20: 0.3,
  Arbitrum: 0.4,
  Polygon: 0.1,
  Solana: 0.05,
  TON: 0.05,
  Bitcoin: 2.5,
  Lightning: 0.01,
}

/** Сетевой сбор для выбранной сети (USD). Фиат-выдача → 0. */
export function networkFeeUsd(net: string): number {
  return NETWORK_FEE_USD[net] ?? 0.5
}
