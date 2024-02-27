// have to import fake-indexeddb/auto before dexie
import "fake-indexeddb/auto";
import {DbRepository} from "../../src/repository/DbRepository";
import {Column} from "../../src/repository/DbRepository";
import {DataPoint} from "../../src/repository/DataPoint";
import Dexie from "dexie";
import {v4 as uuidv4} from "uuid";

describe("IndexDbRepository", () => {
    let repository: DbRepository;
    let testDbName: string;

    beforeEach(() => {
        // create a new db for each test, allowing the tests to be run in parallel
        const testDbName = "TestDb" + uuidv4();
        repository = new DbRepository(testDbName);
    });

    afterEach(async () => {
        await Dexie.delete(testDbName);
    });

    test("addColumn - Add 1 column with all numbers", async () => {
        // confirm that we're having a fresh indexedDB
        const current = await repository.getPoints(false);
        expect(current).toHaveLength(0);

        const column = new Column("test", [1, 2]);
        repository.addColumn(column);

        const result = await repository.getPoints(false);

        expect(result).toHaveLength(2);
        const expected = [new DataPoint(false, [1]),
            new DataPoint(false, [2])];
        expect(result).toEqual(expect.arrayContaining(expected));
    });

    test("addColumn - Add 1 columns with all strings", async () => {
        // confirm that we're having a fresh indexedDB
        const current = await repository.getPoints(false);
        expect(current).toHaveLength(0);

        const column = new Column("test", ["CMPT371", "Osgood", "Oculus"]);
        repository.addColumn(column);

        const result = await repository.getPoints(false);

        expect(result).toHaveLength(3);
        const expected = [new DataPoint(false, ["CMPT371"]),
            new DataPoint(false, ["Osgood"]),
            new DataPoint(false, ["Oculus"])];
        expect(result).toEqual(expect.arrayContaining(expected));
    });

    test("addColumn - Add 2 column with null values", async () => {
        // confirm that we're having a fresh indexedDB
        const current = await repository.getPoints(false);
        expect(current).toHaveLength(0);

        const column1 = new Column("numbers", [1.2, 2.3, null]);
        const column2 = new Column("strings", ["CMPT371", null, "Oculus"]);
        repository.addColumn(column1);
        repository.addColumn(column2);

        const result = await repository.getPoints(false);

        expect(result).toHaveLength(3);
        const expected = [new DataPoint(false, [1.2, "CMPT371"]),
            new DataPoint(true, [2.3, null]),
            new DataPoint(true, [null, "Oculus"])];
        expect(result).toEqual(expect.arrayContaining(expected));
    });

    test("getPoints - Get qualifying points only", async () => {
        // confirm that we're having a fresh indexedDB
        const current = await repository.getPoints(false);
        expect(current).toHaveLength(0);

        const column1 = new Column("column1", [1.1, null, 3.3]);
        const column2 = new Column("column2", ["CheeseCake", "Takoyaki", "Poutine"]);
        const column3 = new Column("column3", [-1.1, -2.2, -3.3]);
        repository.addColumnBulk([column1, column2, column3]);

        const result = await repository.getPoints(true);

        expect(result).toHaveLength(2);
        const expected = [new DataPoint(false, [1.1, "CheeseCake", -1.1]),
            new DataPoint(false, [3.3, "Poutine", -3.3])];
        expect(result).toEqual(expect.arrayContaining(expected));
    });
});