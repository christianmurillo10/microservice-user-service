## Write command to build and start application
.PHONY: help

help:
	$(info ${HELP_MESSAGE})
	@exit 0

dev:
	docker compose up

remove:
	docker compose down

install:
	yarn install

build:
	yarn build

start:
	yarn start

define HELP_MESSAGE

	Common usage:

	make dev # Starts the local development server

	make stop # Stop the local development server
	
	make install # Install the project dependencies

	make build # Builds the app

	make start # Starts the build app

endef