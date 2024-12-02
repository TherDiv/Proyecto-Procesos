module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest', // Asegura que Jest use Babel para archivos JS y JSX
    },
    transformIgnorePatterns: [
      '/node_modules/(?!axios|dayjs)/', // Asegura que estos módulos se transformen
    ],
  };
  