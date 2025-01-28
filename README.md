<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


<p>
Aplicação Rest módulo 1
</p>


## Especificações
1- Extensão prática para fazer requisições do VSCode:
<p style="margin-left: 2em"> a) nome da extensão: REST Client;</p>
<p style="margin-left: 2em"> b) Após instalar a extensão, crie um arquivo client.rest na raiz do projeto;</p>
<p style="margin-left: 2em"> c) Criar as requisições conforme documento do projeto</p>

2- Neste projeto utilizamos o class-validator e o class-transformer para tratar os DTOs, por isso deve-se instalar:
<p style="margin-left: 2em"> a) yarn add class-validator class-transformer</p>
<p style="margin-left: 2em"> b) Configurar o arquivo main.ts conforme exposto</p>

3- Neste projeto utilizamos o typeorm e o driver do postgres:
<p style="margin-left: 2em"> a) Para instalar: yarn add @nestjs/typeorm typeorm pg</p>

4- Neste projeto utilizamos o nest config para lidar com as variáveis de ambiente:
<p style="margin-left: 2em"> a) Para instalar: yarn add @nestjs/config</p>

É importante lembrar que este módulo deve ser importado no app.module para funcionar corretamente.


TEMP:

DATABASE_TYPE='postgres'
DATABASE_HOST='localhost'
DATABASE_PORT=5432
DATABASE_USERNAME='user_m1'
DATABASE_DATABASE='nest-m1'
DATABASE_PASSWORD='123456'
DATABASE_AUTOLOADENTITIES=true
DATABASE_SYNCHRONIZE=true

JWT_SECRET='senhaSecretajwt'
JWT_TOKEN_AUDIENCE='http://localhost:3000'
JWT_TOKEN_ISSUE='http://localhost:3000'
JWT_TTL=3600
JWT_REFRESH_TTL=86400


5- Ao finalizar o projeto (fazer o build), basta rodar npm run build (a aplicação será buildada na pasta dist);
6- para subir a aplicação, rode node .\dist\main.js
