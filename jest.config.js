module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    globalSetup: 'jest-preset-angular/global-setup',
    modulePaths: [
        "<rootDir>",
        "/home/some/other/path"
      ],
    moduleNameMapper: {
        "^~(.*)$": "<rootDir>/src/$1",
        "@app(.*)": "<rootDir>/src/app/$1",
        "@core(.*)": "<rootDir>/src/app/core/$1",
        "@modules(.*)": "<rootDir>/src/app/modules/$1",
        "@shared(.*)": "<rootDir>/src/app/shared/$1",
        "@environments(.*)": "<rootDir>/src/environments/$1",
        "@data(.*)": "<rootDir>/src/app/data/$1",
      }
};