module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',       // Path to your .env file
        blocklist: null,    // Blocklist certain variables (optional)
        allowlist: null,    // Allowlist specific variables (optional)
        safe: false,        // Ensure all variables are defined (optional)
        allowUndefined: true,  // Allow undefined variables (optional)
        verbose: false      // Verbose output for debugging (optional)
      }
    ],
    'react-native-reanimated/plugin', // Reanimated plugin must always be the last entry
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],
  ]
};