import DataLayer from '../data/DataLayer';
import { ColumnType } from '../repository/Column';
import GraphingDataPoint from './GraphingDataPoint';
import createPosition from './Positions';

/**
 * This creates an array of GraphingDataPoint components.
 *
 * This means to work with either 3 PCA columns or 3 raw columns, no mismatch.
 *
 * TODO: we want different scale for each axis.
 * TODO: learn how the axis is set up.
 */
export default async function CreatePlottedDataPoint(
  dataLayer: DataLayer,
  xColumnName: string,
  yColumnName: string,
  zColumnName: string,
  columnType: ColumnType,
  AxisStartPoints: number[],
  length: number,
  scale: number,
  max: number,
) {
  const dataPoints = await dataLayer
    .createDataPointsFrom3Columns(xColumnName, yColumnName, zColumnName, columnType);

  // // Get the max values of each column, in case we want different scales for each axis.
  // const columnXData = await dataLayer.getColumnValues(xColumnName, columnType);
  // const columnYData = await dataLayer.getColumnValues(yColumnName, columnType);
  // const columnZData = await dataLayer.getColumnValues(zColumnName, columnType);
  // const maxXValue = Math.max(...columnXData);
  // const maxYValue = Math.max(...columnYData);
  // const maxZValue = Math.max(...columnZData);

  return dataPoints.map((dataPoint, index) => {
    const position = createPosition({
      data: [dataPoint.xValue, dataPoint.yValue, dataPoint.zValue],
      AxisStartPoints,
      length,
      scale,
      max,
    });

    return (
      <GraphingDataPoint
        /* eslint-disable-next-line react/no-array-index-key */
        key={index}
        id={index}
        marker="circle"
        color="gray"
        columnX={xColumnName}
        columnY={yColumnName}
        columnZ={zColumnName}
        actualData={[dataPoint.xValue, dataPoint.yValue, dataPoint.zValue]}
        size={[0.02, 32, 32]}
        meshProps={{ position }}
      />
    );
  });
}
