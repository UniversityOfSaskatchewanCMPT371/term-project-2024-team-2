const jestConfig = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/setupJest.js', '<rootDir>/jest.polyfills.js'],
    resolver: '<rootDir>jest.resolver.cjs',
    // testEnvironmentOptions: {
    //     customExportConditions: [''],
    // },
    // transformIgnorePatterns: [
    //     "[/\\\\]node_modules[/\\\\].+[^esm]\\.(js|jsx|mjs|cjs|ts|tsx)$",
    //     "^.+\\.module\\.(css|sass|scss)$"
    // ],
    // transform: {
    //     '^.+\\.tsx?$': '@swc/jest',
    // },
};

export default jestConfig;
