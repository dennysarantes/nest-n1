const variaveis = {
    contexto: 'dsv',
    configBanco: {
        tipoBd: 'postgres',
        senhaBd: process.env.BANCO_LOCALHOST,
        host: 'localhost',
        porta: 5432,
    },
    secret_password: process.env.SECRECT_KEY,
};

export const enviroments = {
    variaveis,
};
