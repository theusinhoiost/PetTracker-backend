# PetTracker API

Backend da aplicação PetTracker desenvolvido com NestJS.

O projeto foi criado para gerenciamento de pets com autenticação completa, upload de imagens utilizando AWS S3 e arquitetura modular.

---

# Tecnologias

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication
- Refresh Token
- AWS S3
- Multer
- Docker
- REST API

---

# Funcionalidades

## Autenticação

- Cadastro de usuário
- Login com JWT
- Refresh token
- Rotas protegidas
- Controle de permissões

## Pets

- Criar pet
- Atualizar pet
- Remover pet
- Buscar pets do usuário
- Upload de imagem do pet
- Armazenamento de imagens na AWS S3

## Upload

- Upload multipart/form-data
- Validação de tipo de arquivo
- Validação de tamanho
- Suporte para PNG e JPEG

---

# Arquitetura

O projeto utiliza arquitetura modular do NestJS.

```txt
src/
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   └── s3/
│
├── modules/
│   ├── auth/
│   ├── user/
│   └── pet/
│
├── config/
└── main.ts
```

---

# Variáveis de ambiente

Crie um arquivo `.env`:

```env
DATABASE_URL=
DB_SYNCHRONIZE=
DB_AUTO_LOAD_ENTITIES=

JWT_SECRET=
JWT_EXPIRATION=


ENCRYPT_PASSWORD=
IV_VALUE=


AWS_REGION=
AWS_BUCKET_NAME=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
```

---

# Instalação

## Clone o projeto

```bash
git clone https://github.com/seu-user/pettracker-backend.git
```

## Entre na pasta

```bash
cd pettracker-backend
```

## Instale as dependências

```bash
npm install
```

---

# Rodando o projeto

## Desenvolvimento

```bash
npm run start:dev
```

## Produção

```bash
npm run build
npm run start:prod
```

---

# Upload de imagens

As imagens são armazenadas utilizando AWS S3.

Fluxo:

```txt
Frontend
   ↓
NestJS
   ↓
Multer
   ↓
AWS S3
   ↓
PostgreSQL
```

Exemplo de URL gerada:

```txt
https://bucket-name.s3.region.amazonaws.com/image.png
```

---

# Segurança

- JWT authentication
- Refresh token
- Rotas protegidas
- Validação de arquivos
- Limite de upload
- Controle de ownership dos pets

---

# Endpoints principais

## Auth

| Método | Endpoint      |
| ------ | ------------- |
| POST   | /auth/login   |
| POST   | /auth/refresh |

## User

| Método | Endpoint |
| ------ | -------- |
| POST   | /user    |
| GET    | /user/me |
| PATCH  | /user/me |
| DELETE | /user/me |

## Pets

| Método | Endpoint |
| ------ | -------- |
| POST   | /pet     |
| GET    | /pet     |
| PATCH  | /pet/:id |
| DELETE | /pet/:id |

---

# Exemplo de upload

```http
POST /pet
Content-Type: multipart/form-data
Authorization: Bearer token
```

Campos:

```txt
name
race
species
birthDate
pet-img
```

---

# Objetivo do projeto

O PetTracker foi desenvolvido como projeto de portfólio com foco em backend moderno utilizando NestJS, autenticação JWT e integração com serviços AWS.

O projeto busca simular funcionalidades utilizadas em aplicações SaaS reais.

---

# Melhorias futuras

- Deploy em cloud
- CI/CD
- Presigned URLs
- Cache com Redis
- Upload múltiplo
- Dashboard administrativo
- Notificações
- Monitoramento
- Testes automatizados

---

# Autor

Matheus Iost

Full Stack Developer
