# ─── Mini Binance – Comandos ────────────────────────────────────────────────

.PHONY: help setup up down migrate test test-backend test-mobile logs

# Exibe os comandos disponíveis
help:
	@echo ""
	@echo "  Mini Binance – comandos disponíveis"
	@echo ""
	@echo "  Ambiente"
	@echo "  ──────────────────────────────────────"
	@echo "  make setup          Copia o .env e sobe tudo pela primeira vez"
	@echo "  make up             Sobe os containers Docker"
	@echo "  make down           Para os containers"
	@echo "  make migrate        Executa as migrations dentro do container"
	@echo ""
	@echo "  Testes"
	@echo "  ──────────────────────────────────────"
	@echo "  make test           Roda backend + mobile juntos"
	@echo "  make test-backend   Roda os testes PHPUnit (Laravel)"
	@echo "  make test-mobile    Roda os testes Jest (React Native)"
	@echo ""
	@echo "  Logs"
	@echo "  ──────────────────────────────────────"
	@echo "  make logs           Exibe logs do container da API"
	@echo ""

# Configuração inicial completa
setup:
	@echo "→ Copiando .env..."
	@cd backend && cp -n .env.example .env || true
	@echo "→ Subindo containers..."
	@cd backend && docker-compose up -d --build
	@echo "→ Aguardando banco de dados ficar pronto..."
	@sleep 5
	@echo "→ Rodando migrations..."
	@docker exec desafio_app php artisan migrate --force
	@echo ""
	@echo "✓ Backend pronto em http://localhost:8000"
	@echo "✓ Docs da API em  http://localhost:8000/docs/api"
	@echo "✓ Adminer em      http://localhost:8080"

# Sobe os containers
up:
	@cd backend && docker-compose up -d

# Para os containers
down:
	@cd backend && docker-compose down

# Migrations
migrate:
	@docker exec desafio_app php artisan migrate

# Testes backend (PHPUnit – roda dentro do container)
test-backend:
	@echo "→ Rodando testes PHPUnit..."
	@docker exec desafio_app php artisan test

# Testes mobile (Jest – roda localmente)
test-mobile:
	@echo "→ Rodando testes Jest..."
	@cd mobile && npm test -- --passWithNoTests

# Tudo junto
test: test-backend test-mobile

# Logs da API
logs:
	@docker logs -f desafio_app
