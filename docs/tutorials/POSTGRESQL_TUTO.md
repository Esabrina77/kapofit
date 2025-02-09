# Guide PostgreSQL - KaporalFit

## Table des Matières
1. [Installation](#1-installation)
2. [Configuration avec Docker](#2-configuration-avec-docker)
3. [Configuration Locale](#3-configuration-locale)
4. [Commandes Utiles](#4-commandes-utiles)
5. [Troubleshooting](#5-troubleshooting)

## 1. Installation

### Deux options possibles :
1. **Via Docker (Recommandé)**
   - Plus simple à configurer
   - Environnement isolé
   - Même configuration en dev/prod

2. **Installation Locale**
   - Utile pour le développement
   - Accès direct à psql

## 2. Configuration avec Docker

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14
    container_name: kaporalfit-postgres
    environment:
      POSTGRES_USER: kaporalfit
      POSTGRES_PASSWORD: kaporalfit
      POSTGRES_DB: kaporalfit
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Lancement
```bash
# Démarrer PostgreSQL
docker-compose up -d postgres

# Vérifier que le container tourne
docker ps

# Voir les logs
docker-compose logs -f postgres
```

### Connection String pour Prisma
```env
# .env
DATABASE_URL="postgresql://kaporalfit:kaporalfit@localhost:5432/kaporalfit"
```

## 3. Configuration Locale

### Installation (si nécessaire)

**Sur MacOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Sur Ubuntu:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Sur Windows:**
- Télécharger l'installateur sur postgresql.org
- Suivre l'assistant d'installation

### Création de la Base de Données
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer l'utilisateur et la base
CREATE USER kaporalfit WITH PASSWORD 'kaporalfit';
CREATE DATABASE kaporalfit;
GRANT ALL PRIVILEGES ON DATABASE kaporalfit TO kaporalfit;
```

## 4. Commandes Utiles

### Docker
```bash
# Accéder au shell PostgreSQL dans Docker
docker exec -it kaporalfit-postgres psql -U kaporalfit

# Backup de la base
docker exec -t kaporalfit-postgres pg_dump -U kaporalfit kaporalfit > backup.sql

# Restore de la base
cat backup.sql | docker exec -i kaporalfit-postgres psql -U kaporalfit -d kaporalfit
```

### PostgreSQL CLI (psql)
```bash
# Connection
psql -U kaporalfit -d kaporalfit

# Commandes utiles dans psql
\l        # Lister les bases
\dt       # Lister les tables
\d table  # Décrire une table
\q        # Quitter
```

## 5. Troubleshooting

### Problèmes Courants

1. **Erreur de Connection**
```bash
# Vérifier que PostgreSQL tourne
docker ps | grep postgres

# Vérifier les logs
docker-compose logs postgres

# Tester la connection
psql -h localhost -U kaporalfit -d kaporalfit
```

2. **Port déjà utilisé**
```bash
# Trouver le processus utilisant le port 5432
sudo lsof -i :5432

# Changer le port dans docker-compose.yml
ports:
  - "5433:5432"  # Utilise le port 5433 en local
```

3. **Permissions**
```sql
-- Dans psql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO kaporalfit;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO kaporalfit;
```

### Vérification de la Configuration

1. **Test de Connection Prisma**
```bash
# Vérifier la connection
npx prisma db pull

# Si ça marche, vous verrez les tables existantes
# Si erreur, vérifier DATABASE_URL dans .env
```

2. **Test Manuel**
```bash
# Via psql
psql -h localhost -U kaporalfit -d kaporalfit -c "SELECT 1"
```

## Ressources
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [PostgreSQL avec Docker](https://hub.docker.com/_/postgres)
- [Prisma avec PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql) 