import { DataAbstractor } from './DataAbstractor';

export default class DataLayer implements DataAbstractor {
  private static instance: DataLayer;

  private myField: boolean;

  private constructor() {
    this.myField = true;
  }

  public static getInstance(): DataLayer {
    if (!DataLayer.instance) {
      DataLayer.instance = new DataLayer();
    }
    return DataLayer.instance;
  }

  async getAvailableFields() {
    this.myField = false;
    return Promise.resolve(true);
  }
}
