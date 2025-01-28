const variaveis = {
    contexto: 'local',
    configBanco: {
        tipoBd: 'postgres',
        senhaBd: process.env.BANCO_LOCALHOST,
        host: 'localhost',
        porta: 5432,
        username: 'user_m1',
        password: '123456',
        nomeBd: 'nest-m1',
    },
    secret_password: process.env.SECRET_KEY || 'flamengo',
    REMOVER_SPACES_REGEX: 'REMOVER_SPACES_REGEX',
    APENAS_LOWER_CASE_REGEX: 'APENAS_LOWER_CASE_REGEX',
    serverName: 'Servidor Nest.js',
};

export const enviroments = {
    variaveis,
};
