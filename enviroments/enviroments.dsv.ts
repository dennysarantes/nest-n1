const variaveis = {
    configBanco: {
        tipoBd: 'postgres',
        senhaBd: process.env.BANCO_LOCALHOST,
        host: 'localhost',
        porta: 5432,
    },
};

export const enviroments = {
    variaveis,
};
