const jestConfig = {
    preset: 'ts-jest',
    testEnvironment: 'node',
};

export default jestConfig;

//This tells Jest to look for modules not only in the node_modules directory but also in the src directory
module.exports = {
    // other configurations
    moduleDirectories: ['node_modules', 'src'],
};



