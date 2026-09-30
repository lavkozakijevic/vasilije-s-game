export interface SpriteProps {
  /** Horizontal sprite strip PNG (equal frame size, no padding). */
  src: string;
  frames?: number;
  frameWidth?: number;
  frameHeight?: number;
  /** Integer upscale factor. Default 3. */
  scale?: number;
  fps?: number;
  loop?: boolean;
  /** Mirror horizontally (sprites face right by default). */
  flip?: boolean;
  playing?: boolean;
  /** Freeze on a specific frame index. */
  frame?: number;
  style?: React.CSSProperties;
}
export function Sprite(props: SpriteProps): JSX.Element;
