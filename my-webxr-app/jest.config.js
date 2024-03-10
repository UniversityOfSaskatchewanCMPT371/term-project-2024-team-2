const jestConfig = {
  projects: [
    {
      displayName: 'dom',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      setupFiles: ['<rootDir>/jest.polyfills.js'],
      resolver: '<rootDir>jest.resolver.cjs',
      testMatch: ['<rootDir>/tests/**/*.test.jsdom.tsx?(x)']
    },
    {
      displayName: 'node',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/tests/**/*.test.tsx?(x)',
      ]
    },
  ],
};

export default jestConfig;