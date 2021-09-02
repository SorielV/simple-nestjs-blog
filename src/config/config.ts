export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface JWTConfig {
  secret: string;
  expirationTime: number;
}

export interface ServerConfig {
  port: number;
  host: string;
}

export interface MailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export interface RedisConfig {
  host: string;
  port: number;
}

export interface Config {
  server: ServerConfig;
  database: DatabaseConfig;
  jwt: JWTConfig;
  mail: MailConfig;
  redis: RedisConfig;
}

export default (): Config => ({
  server: {
    port: +process.env.PORT || 3000,
    host: process.env.HOST ?? '0.0.0.0',
  },
  database: {
    host: process.env.BD_HOST,
    port: +process.env.DB_PORT || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expirationTime: +process.env.JWT_EXPIRATION_TIME,
  },
  mail: {
    host: '127.0.0.1',
    port: 1000,
    user: 'foo',
    password: 'bar',
    from: 'no-reply foo@foo.com',
  },
  redis: {
    host: '127.0.0.1',
    port: 7001,
  },
});
