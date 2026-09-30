export interface HeartMeterProps {
  /** Current health in hearts; .5 steps render a half heart. */
  value?: number;
  max?: number;
  scale?: number;
  /** 3-frame strip: full, half, empty. */
  src?: string;
}
export function HeartMeter(props: HeartMeterProps): JSX.Element;
