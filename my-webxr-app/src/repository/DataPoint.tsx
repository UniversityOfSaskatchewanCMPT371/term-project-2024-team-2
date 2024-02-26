export class DataPoint {
    hasMissingData: boolean;
    values: Array<number | string | null>;
    constructor(hasMissingData: boolean, values: Array<number | string | null>) {
        this.hasMissingData = hasMissingData;
        this.values = values;
    }
}