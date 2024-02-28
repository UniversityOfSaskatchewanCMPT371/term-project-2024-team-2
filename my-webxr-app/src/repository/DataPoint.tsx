export class DataPoint {
    hasMissingData: boolean;
    xValue: number | string | null;
    yValue: number | string | null;
    zValue: number | string | null;
    constructor(hasMissingData: boolean,
                xValue: number | string | null,
                yValue: number | string | null,
                zValue: number | string | null) {
        this.hasMissingData = hasMissingData;
        this.xValue = xValue;
        this.yValue = yValue;
        this.zValue = zValue;
    }
}