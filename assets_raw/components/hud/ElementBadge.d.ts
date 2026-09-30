export interface ElementBadgeProps {
  element?: 'fire' | 'water' | 'earth' | 'air' | 'ice' | 'lightning' | 'shadow' | 'light';
  /** Override icon path. Defaults to assets/ui/icon_element_<element>.png (only fire exists so far). */
  icon?: string;
  scale?: number;
  /** Active adds the element-colored ring. */
  active?: boolean;
  label?: string;
}
export function ElementBadge(props: ElementBadgeProps): JSX.Element;
