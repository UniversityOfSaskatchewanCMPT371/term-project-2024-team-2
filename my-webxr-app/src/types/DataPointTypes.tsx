import { OctahedronGeometryProps } from '@react-three/fiber';

/**
 * Define an interface to require an ID number to differentiate each GraphingDataPoint
 * and allow other mesh properties to be set.
 */
export interface DataPointProps {
  id: number;
  columnX: string;
  columnY: string;
  columnZ: string;
  optionalColumns?: string[];
  color: string
  marker: string
  actualXYZData?: Array<number | undefined>;
  optionalColumnData?: Array<string>;
  outlineScale?: number;
  size?: OctahedronGeometryProps['args'];
  meshProps?: JSX.IntrinsicElements['mesh'];
}
