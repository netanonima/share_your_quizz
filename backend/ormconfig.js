let databaseConfig = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'phpmyadmin',
  password: 'phpmyadmin',
  database: 'share_your_quizz',
  synchronize: true,
  logging: true,
  autoLoadEntities: true,
};

if (process.env.NODE_ENV === 'production') {
  databaseConfig = {
    ...databaseConfig,
    entities: ['dist/**/*.entity.js'],
  };
} else {
  databaseConfig = {
    ...databaseConfig,
    entities: ['src/**/*.entity.ts'],
  };
}

module.exports = databaseConfig;
