/**
 * @startingPoint section="Menus" subtitle="Beveled pixel button: normal, hover, pressed, disabled" viewport="700x260"
 */
export interface PixelButtonProps {
  children?: React.ReactNode;
  /** primary = flame CTA, secondary = stone, ghost = menu list item with ▶ cursor on hover/selected. */
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Keyboard/gamepad focus state; renders like hover. */
  selected?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export function PixelButton(props: PixelButtonProps): JSX.Element;
