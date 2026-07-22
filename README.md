# Mini Binance – Plataforma de Trading

Aplicação fullstack de compra e venda de Bitcoin.  
Backend em **Laravel 12** · Mobile em **Expo / React Native** · Banco **MySQL** · Cache **Redis**

---

## Sumário

- [Antes de começar](#antes-de-começar--instale-o-necessário)
- [Rodando localmente com Docker](#rodando-localmente-com-docker)
- [Deploy no Railway (produção)](#deploy-no-railway-produção)
- [Configurando o app mobile](#configurando-o-app-mobile)
- [Rodando os testes](#rodando-os-testes)
- [Visualizando o banco de dados](#visualizando-os-dados-no-banco-adminer)
- [Endpoints da API](#endpoints-da-api)
- [O que foi implementado](#o-que-foi-implementado)

---

## Antes de começar – instale o necessário

| Programa | Para que serve | Download |
|----------|---------------|----------|
| **Docker Desktop** | Roda o backend, banco e Redis com um único comando | https://www.docker.com/products/docker-desktop |
| **Node.js** (versão 20 ou superior) | Roda o app mobile | https://nodejs.org |
| **Expo Go** (no celular) | Visualiza o app no seu celular | App Store / Google Play |

Depois de instalar, abra o **Docker Desktop** e aguarde ele iniciar completamente antes de continuar.

---

## Rodando localmente com Docker

### Passo 1 — Entre na pasta do projeto

```bash
cd desafio
```

### Passo 2 — Configure as variáveis de ambiente

```bash
cd backend
cp .env.example .env
```

Abra o arquivo `backend/.env` e preencha as senhas do banco (pode ser qualquer valor):

```env
DB_ROOT_PASSWORD=qualquer_senha
DB_USERNAME=desafio
DB_PASSWORD=qualquer_senha
```

### Passo 3 — Suba os containers

```bash
# Ainda dentro da pasta backend/
docker-compose up -d --build
```

Na primeira vez esse comando vai baixar as imagens e instalar as dependências — pode levar alguns minutos.

O que sobe automaticamente:

| Container | O que faz | Endereço |
|-----------|-----------|----------|
| `desafio_app` | API Laravel | http://localhost:8000 |
| `desafio_db` | Banco MySQL | localhost:3306 |
| `desafio_redis` | Cache Redis (preço do BTC) | localhost:6379 |
| `desafio_adminer` | Painel visual do banco | http://localhost:8080 |

### Passo 4 — Crie as tabelas no banco

```bash
docker exec desafio_app php artisan migrate
```

> Só precisa rodar isso uma vez. Nas próximas vezes o `docker-compose up -d` já é suficiente.

### Passo 5 — Verifique se está tudo rodando

```bash
docker ps
```

Você deve ver 4 containers com status `Up`. Teste no navegador:

- API: **http://localhost:8000/api**
- Swagger: **http://localhost:8000/docs/api**
- Adminer: **http://localhost:8080**

---

## Atalhos com Make (opcional)

O arquivo `Makefile` na raiz do projeto serve para encurtar os comandos mais usados. Em vez de digitar o comando completo, você usa `make` + um nome curto.

> Disponível por padrão no Mac e Linux. No Windows instale via [chocolatey](https://chocolatey.org/): `choco install make`

| Comando | O que faz |
|---------|-----------|
| `make setup` | Copia o `.env`, sobe os containers e roda as migrations — tudo em um comando |
| `make up` | Sobe os containers Docker |
| `make down` | Para os containers |
| `make migrate` | Roda as migrations |
| `make test` | Roda todos os testes (backend + mobile) |
| `make test-backend` | Só os testes PHPUnit |
| `make test-mobile` | Só os testes Jest |
| `make logs` | Exibe os logs da API em tempo real |

O `Makefile` é apenas para uso **local** — o Railway não o utiliza.

---

## Deploy no Railway (produção)

O Railway usa o mesmo **Dockerfile** que o ambiente local — não precisa criar nada separado. A diferença é que o Railway fornece o banco e o Redis como serviços gerenciados, então as variáveis de conexão mudam.

### O que o Dockerfile faz no Railway

Quando o Railway faz o deploy, ele:

1. Constrói a imagem a partir do `Dockerfile` na raiz do backend
2. Executa automaticamente o `entrypoint.sh` que:
   - Roda `php artisan migrate --force` (aplica as migrations)
   - Cacheia as configurações e rotas
   - Inicia o servidor na porta que o Railway fornecer via `$PORT`

Você não precisa fazer nada disso manualmente.

### Passo a passo no Railway

**1. Crie uma conta em https://railway.app e clique em "New Project"**

**2. Adicione os serviços de infraestrutura:**

No painel do projeto, clique em **"+ Add Service"** e adicione:
- **MySQL** — banco de dados
- **Redis** — cache

**3. Adicione o serviço da API:**

Clique em **"+ Add Service" → "GitHub Repo"** e selecione este repositório.

Quando perguntar o diretório raiz, informe:
```
backend
```

O Railway vai detectar o Dockerfile automaticamente em `docker/php/Dockerfile`.

**4. Configure as variáveis de ambiente da API:**

Na aba **"Variables"** do serviço da API, adicione as seguintes variáveis. Os valores de banco e Redis vêm das abas dos serviços MySQL e Redis que você criou:

| Variável | Valor |
|----------|-------|
| `APP_NAME` | `BitTrade` |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_KEY` | `base64:zWiFb7K7KtQIfVQuM7sLyvkH5tOtvZK//BHRIT5SLtY=` |
| `APP_URL` | URL gerada pelo Railway (ex: `https://seu-app.railway.app`) |
| `DB_CONNECTION` | `mysql` |
| `DB_HOST` | Aba "Variables" do serviço MySQL → `MYSQLHOST` |
| `DB_PORT` | Aba "Variables" do serviço MySQL → `MYSQLPORT` |
| `DB_DATABASE` | Aba "Variables" do serviço MySQL → `MYSQLDATABASE` |
| `DB_USERNAME` | Aba "Variables" do serviço MySQL → `MYSQLUSER` |
| `DB_PASSWORD` | Aba "Variables" do serviço MySQL → `MYSQLPASSWORD` |
| `REDIS_HOST` | Aba "Variables" do serviço Redis → `REDISHOST` |
| `REDIS_PORT` | Aba "Variables" do serviço Redis → `REDISPORT` |
| `REDIS_PASSWORD` | Aba "Variables" do serviço Redis → `REDISPASSWORD` |
| `CACHE_STORE` | `redis` |
| `SESSION_DRIVER` | `redis` |

> **Dica:** O Railway tem uma funcionalidade de "Reference Variable" que preenche automaticamente os valores dos outros serviços. Clique no campo da variável e selecione a referência correspondente.

**6. Faça o deploy**

Salve as variáveis e clique em **"Deploy"**. O Railway vai:
- Construir a imagem Docker
- Rodar as migrations automaticamente via `entrypoint.sh`
- Expor a API em uma URL pública

Anote a URL gerada (ex: `https://seu-app.railway.app`) — você vai precisar dela para configurar o app mobile.

---

## Diferença entre local e Railway

| | Local (Docker Compose) | Railway (produção) |
|-|------------------------|---------------------|
| **Dockerfile** | O mesmo `docker/php/Dockerfile` | O mesmo `docker/php/Dockerfile` |
| **Migrations** | `docker exec desafio_app php artisan migrate` | Automático via `entrypoint.sh` |
| **Porta** | `8000` (fixo no `.env`) | Dinâmica (`$PORT` injetada pelo Railway) |
| **Banco** | MySQL no container `desafio_db` | MySQL gerenciado pelo Railway |
| **Redis** | Redis no container `desafio_redis` | Redis gerenciado pelo Railway |
| **Adminer** | http://localhost:8080 | Não sobe (só para desenvolvimento) |
| **Variáveis** | Arquivo `.env` local | Painel de variáveis do Railway |

---

## Configurando o app mobile

O celular precisa saber onde está a API. Abra `mobile/src/services/api.ts` e troque o IP/URL:

**Desenvolvimento local** (API rodando no seu computador):
```ts
// Descubra seu IP: ipconfig getifaddr en0 (Mac) ou ipconfig (Windows)
export const API_URL = 'http://SEU_IP_LOCAL:8000/api';
```

**Produção** (API no Railway):
```ts
export const API_URL = 'https://seu-app.railway.app/api';
```

> Celular e computador precisam estar na mesma rede Wi-Fi para o ambiente local funcionar.

### Rodando o app

```bash
cd mobile
npm install
npx expo start
```

Escaneie o QR code com o **Expo Go** no celular.

---

## Rodando os testes

### Backend – 32 testes (PHPUnit)

```bash
# Dentro do container local
docker exec desafio_app php artisan test

# Via Make
make test-backend
```

### Mobile – 21 testes (Jest)

```bash
cd mobile
npm test

# Via Make
make test-mobile
```

### Tudo junto

```bash
make test
```

---

## Encerrando o ambiente local

```bash
cd backend
docker-compose down

# Para parar e apagar todos os dados do banco (recomeçar do zero)
docker-compose down -v
```

---

## Se algo der errado

**Docker não sobe**  
Aguarde o Docker Desktop terminar de iniciar. Veja os logs:
```bash
docker logs desafio_app
docker logs desafio_db
```

**App não conecta na API (erro de rede)**
- Confirme que celular e computador estão na mesma rede Wi-Fi
- Confirme que o IP em `mobile/src/services/api.ts` está correto
- Teste no navegador do celular: `http://SEU_IP:8000/api`

**Migrations não rodaram no Railway**  
Veja os logs de deploy no painel do Railway. Se der erro de conexão com banco, confirme que as variáveis `DB_HOST`, `DB_PORT` etc. estão preenchidas corretamente.

**Banco de dados vazio localmente**
```bash
docker exec desafio_app php artisan migrate
```

---

## Visualizando os dados no banco (Adminer)

Disponível apenas no ambiente local em: **http://localhost:8080**

| Campo | Valor |
|-------|-------|
| **Sistema** | MySQL |
| **Servidor** | `desafio_db` |
| **Usuário** | valor de `DB_USERNAME` no `.env` |
| **Senha** | valor de `DB_PASSWORD` no `.env` |
| **Base de dados** | `desafio` |

Tabelas disponíveis:

| Tabela | O que contém |
|--------|-------------|
| `users` | Usuários cadastrados |
| `wallets` | Saldo BRL e BTC por usuário |
| `transactions` | Histórico de compras e vendas |
| `personal_access_tokens` | Tokens de autenticação |

---

## Endpoints da API

Documentação interativa: **http://localhost:8000/docs/api** (local) ou **https://seu-app.railway.app/docs/api** (Railway)

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/register` | Criar conta |
| `POST` | `/api/login` | Entrar e receber token |
| `POST` | `/api/logout` | Sair |
| `GET` | `/api/me` | Dados do usuário logado |
| `GET` | `/api/wallet` | Saldo BRL e BTC |
| `GET` | `/api/market/btc` | Preço atual do Bitcoin |
| `POST` | `/api/trade/buy` | Comprar BTC — body: `{ "amount_brl": "1000.00" }` |
| `POST` | `/api/trade/sell` | Vender BTC — body: `{ "amount_btc": "0.00400000" }` |
| `GET` | `/api/transactions` | Histórico — filtros: `?type=buy&min_amount=500` |

Todos os endpoints (exceto `/register` e `/login`) exigem:
```
Authorization: Bearer {token_recebido_no_login}
```

---

## O que foi implementado

### Requisitos do desafio

| Requisito | Status |
|-----------|--------|
| Registro e login de usuário (Sanctum) | Implementado |
| Endpoint protegido `/me` | Implementado |
| Carteira com saldo inicial R$ 10.000 e 0 BTC | Implementado |
| Endpoint `GET /wallet` | Implementado |
| Preço fake do BTC (range 200k–300k) | Implementado |
| Endpoint `GET /market/btc` | Implementado |
| Compra de BTC com validação de saldo | Implementado |
| Venda de BTC com validação de saldo | Implementado |
| Histórico de transações | Implementado |
| Tela de login e registro no app | Implementado |
| Dashboard com saldos e preço do BTC | Implementado |
| Tela de trade (comprar/vender) | Implementado |
| Tela de histórico com filtros | Implementado |

### Diferenciais implementados

| Diferencial | Como foi feito |
|-------------|----------------|
| Cache com Redis | Preço do BTC cacheado por 30s — evita recalcular a cada requisição |
| Testes automatizados | 32 testes PHPUnit (backend) + 21 testes Jest (mobile) |
| Controle de concorrência | `DB::transaction` + `lockForUpdate()` — impede saldo negativo em operações simultâneas |
| Docker | Ambiente completo em Docker Compose para rodar localmente com um comando |
| Documentação da API | Swagger auto-gerado via Scramble em `/docs/api` |
