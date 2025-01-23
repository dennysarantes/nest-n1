export class TokenPayloadDto {
    sub: string | number;
    email?: string;
    roles?: string[];
    iat?: number;
    exp?: number;
    aud?: string;
    iss?: string;
}
