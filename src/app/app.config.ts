import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    database: {
        type: process.env.DATABASE_TYPE as 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USERNAME,
        database: process.env.DATABASE_DATABASE,
        password: process.env.DATABASE_PASSWORD,
        autoLoadEntities: Boolean(process.env.DATABASE_AUTOLOADENTITIES),
        synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
    },
    jwt_config:{
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_TOKEN_AUDIENCE,
        issue: process.env.JWT_TOKEN_ISSUE,
        ttl: Number(process.env.JWT_TTL) ?? 3600,
        ttlRefresh: Number(process.env.JWT_REFRESH_TTL) ?? 86400
    },
    environment: process.env.NODE_ENV || 'development',
}));
