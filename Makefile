arguments = `arg="$(filter-out $@,$(MAKECMDGOALS))" && echo $${arg:-${1}}`

docker-start:
	@docker-compose -f docker-compose.yml up -d --build

docker-stop:
	@docker-compose -f docker-compose.yml down --rmi all

run:
	@make docker-exec cmd="node ./dist/cli.js $(call arguments, --help)"

%:
	@true
