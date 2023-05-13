.PHONY: compile deploy clean upgrade test

all : compile

clean:
	yarn clean

compile: clean
	yarn compile

test: 
	yarn test
deploy: 
	yarn hardhat run scripts/deploy.ts

upgrade:
	yarn hardhat run scripts/upgrade.ts