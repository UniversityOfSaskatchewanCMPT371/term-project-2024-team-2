import {add} from "./TestFunctions";


/**
 * This document contains some basic sample of how to test using Jest.
 *
 * Jest was the chosen tool for unit testing this project. We will use it to
 * perform all possible unit test cases on the project.
 *
 *
 * To run the tests, Verify that you are in the my-web-xr-app using the
 * cd my-webxr-app from the root of the project.
 *
 * Then to run the test use npm test in the webstorm terminal located at the bottom of the
 * page
 *
 * When creating a new test file for unit tests, confirm that you use the .tests.tsx or else jest
 * will not pick up the new unit tests
 */


/**
 * Test To Verify that jest is working
 */
describe('App', () => {
    it('should work as expected', () => {
        expect(1 + 1).toBe(2);
    });
});


/**
 * Test to verify function we exported works as expected
 */
describe('addFunction', () => {
    it('Should add numbers correctly', () => {
        expect(add(5, 3)).toBe(8);
    });
});

/**
 * Mocking
 *
 * Mocking in Jest is a powerful technique used to isolate test subjects by replacing their dependencies with objects
 * that you can control and inspect. Let’s dive into the details:
 * Mock Function:
 * The Mock Function is the cornerstone of mocking in Jest. It allows you to:
 * Capture calls made to the function.
 * Set return values for specific scenarios.
 * Change the implementation of the function.
 */

/**
 * Testing that a url loads using mocking
 */
// describe('LoadingURL', () => {
//     it('Should succesfully load firebase', () => {
//         expect()
//     })
// })