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
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expirationTime: +process.env.JWT_EXPIRATION_TIME,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: +process.env.MAIL_PORT,
    user: process.env.MAIL_AUTH_USER,
    password: process.env.MAIL_AUTH_PASSWORD,
    from: process.env.MAIL_FROM_MSG,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
  },
});
