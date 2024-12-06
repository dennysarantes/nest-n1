const variaveis = {
    contexto: 'local',
    configBanco: {
        tipoBd: 'postgres',
        senhaBd: process.env.BANCO_LOCALHOST,
        host: 'localhost',
        porta: 5432,
        username: 'user_m1',
        password: '12345',
        nomeBd: 'nest-m1',
    },
    secret_password: process.env.SECRET_KEY,
};

export const enviroments = {
    variaveis,
};
