import { enviroments } from 'enviroments/enviroments';
import * as crypto from 'crypto';

const criptografar = (valor: string) => {
    let secretKey = enviroments.variaveis.secret_password;
    if (!secretKey) {
        throw new Error('SECRET_KEY não definida nas variáveis de ambiente.');
    }

    // Garante que a chave tenha exatamente 32 bytes usando SHA-256
    secretKey = crypto.createHash('sha256').update(secretKey).digest('hex');

    const iv = crypto.randomBytes(16); // IV de 16 bytes
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(secretKey, 'hex'),
        iv,
    );

    let encrypted = cipher.update(valor, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
};

const descriptografar = (encryptedValue) => {
    let secretKey = enviroments.variaveis.secret_password;
    if (!secretKey) {
        throw new Error('SECRET_KEY não definida nas variáveis de ambiente.');
    }

    // Garante que a chave tenha exatamente 32 bytes usando SHA-256
    secretKey = crypto.createHash('sha256').update(secretKey).digest('hex');

    // Separa o IV e o texto criptografado
    const [ivHex, encryptedText] = encryptedValue.split(':');
    if (!ivHex || !encryptedText) {
        throw new Error('Formato de texto criptografado inválido.');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(secretKey, 'hex'),
        iv,
    );

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

export const UtilShared = {
    criptografar,
    descriptografar,
};
