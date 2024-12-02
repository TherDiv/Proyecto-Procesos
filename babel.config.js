module.exports = {
    presets: [
      ['@babel/preset-env', {
        modules: 'auto', // Esto asegura que Babel pueda manejar módulos ES6
      }],
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-proposal-private-methods',
      '@babel/plugin-proposal-private-property-in-object',
    ],
  };
  