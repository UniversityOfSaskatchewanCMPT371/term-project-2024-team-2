import { SphereGeometryProps } from '@react-three/fiber';

/**
 * Define an interface to require an ID number to differentiate each GraphingDataPoint
 * and allow other mesh properties to be set.
 */
export interface DataPointProps {
  id: number;
  columnX: string;
  columnY: string;
  columnZ: number;
  color: string
  marker: string
  outlineScale?: number;
  size?: SphereGeometryProps['args'];
  meshProps?: JSX.IntrinsicElements['mesh'];
}
