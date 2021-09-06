
## Social Network Project Backend
Fully typesafe backend with Nest.js framework and Prisma ORM with mysql datebase.
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="200" alt="Nest Logo" /></a>
</p>


## Installation

```bash
$ yarn install
```

## Configuration

- Add the database connection url in prisma/schema.prisma file
  - URL = mysql://USER:PASSWORD@HOST:PORT/DATABASE
 
```bash
# Create database tables with Prisma Migrate
$ npx prisma migrate dev --name init


## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

