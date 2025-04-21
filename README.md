# 🚀 Before starting local developlment

## Run application via Docker

1. Copy .env/.env.local to root directory .env
4. Start application using `make dev`
4. Stop application using `make remove`
5. To access this in your local, go to `http://localhost:5002`

## Run application manually:

1. Copy .env/.env.local to root directory .env
2. Create a DB named "boilerplate_user_database" using MySQL. `(Go to Setup Instructions (below) first to setup everything we need for local development)`
3. Install all dependencies using `npm install`
4. Start application using `npm run dev`
5. To access this in your local, go to `http://localhost:3000`

## Setup Instructions:

## MySQL Setup:

1. Download and install xampp version 7.4.29
   - For Mac User: https://sourceforge.net/projects/xampp/files/XAMPP%20Mac%20OS%20X/7.4.29/xampp-osx-7.4.29-1-installer.dmg/download.
   - For Windows User: https://www.apachefriends.org/download.html
2. Run the application after you install it and connect to local database.
3. Go to /env/.env.local under the root folder for database credentials under `DATABASE_URL` variables.
4. Create database named "boilerplate_user_database".
5. Go to step 3 above `(Under Setup Application)` and run the application.

## Tools for database:

1. For Mac User: Go to App Store and search for `Sequel Ace`. Download and install it.
2. For Windows User: Go to https://www.heidisql.com/. Download and install it.
3. Or use any database tools for your database administrator.

## Postman Setup:

1. Go to https://www.postman.com/downloads/. Download and install it.
2. Go to postman folder under the root folder and import the postman collection and environment.
3. After you import select the `boilerplate_user_database` environment on the upper right side of the postman application.
4. After you select the environment you now can use the postman collectios for `User Service `.

## Technology Stack

1. express - https://expressjs.com/
2. typescript - https://www.typescriptlang.org/
3. kafkajs - https://kafka.js.org/
4. prisma - https://www.prisma.io/docs/
5. lodash - https://lodash.com/
6. joi - https://joi.dev/api/?v=17.6.0/