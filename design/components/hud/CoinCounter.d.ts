export interface CoinCounterProps {
  count?: number;
  /** Zero-pad width. Default 3. */
  digits?: number;
  scale?: number;
  src?: string;
  /** Animate the coin icon. */
  spin?: boolean;
}
export function CoinCounter(props: CoinCounterProps): JSX.Element;
