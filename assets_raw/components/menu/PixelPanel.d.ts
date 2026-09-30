/**
 * @startingPoint section="Menus" subtitle="Beveled stone frame for pause, dialogs and level results" viewport="700x320"
 */
export interface PixelPanelProps {
  children?: React.ReactNode;
  /** Optional blackletter header (Jacquard 24, gold). */
  title?: string;
  tone?: 'stone' | 'dark' | 'parchment';
  /** Inner padding in px. */
  padding?: number;
  style?: React.CSSProperties;
}
export function PixelPanel(props: PixelPanelProps): JSX.Element;
