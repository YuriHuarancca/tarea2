# Nombre del proyecto
ECOMMERCE PLATFORM

## Descripción
Es un proyecto que conecta los microservicios Categorias y Productos con un Api-Gateway

## Pruebas
Entrar a la apigateway>test>prueba.rest

## Variables de entorno 
El gateway tiene:
HOST=localhost
PORT=3000
PRODUCTS_MS_HOST=localhost
PRODUCTS_MS_PORT=3001
CATEGORIES_MS_HOST=localhost
CATEGORIES_MS_PORT=3002

categories-ms tiene:
HOST=localhost
PORT=3002
NODE_ENV="development"
DATABASE_URL="postgresql://postgres:123@localhost:5432/categories-db"

products-ms tiene:
HOST=localhost
PORT=3001
NODE_ENV="development"
DATABASE_URL="mysql://root:@localhost:3306/products_db"

