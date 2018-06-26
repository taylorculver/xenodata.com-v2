# xenodatapartners.com

Code for XenoDATA Partners website

## Development Instructions

Local development services are managed via Docker and `docker-compose`. Everything needed to develop and test the site locally may be started with the following command:

```shell
docker-compose up
```

The test suite can run with the following command:

```shell
docker-compose run --rm app npm test
```

**Note:** You will need to create a `.env.local` file with real values for the following ENV keys:

* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`

### HTML Website

The HTML files currently live at the root of the project. A local web server may be run for previewing content:

```shell
docker-compose up web
```

### Lambda Components

The JavaScript sources for Lambda functions are found in the `src/` directory and tests are located in the `test/` directory. A local sandbox server may be run for testing the JS functions:

```shell
docker-compose up app
```

## Deployment Instructions

The HTML website is deployed with the following command:

[INSERT HTML DEPLOY COMMAND HERE]

The Lambda functions are deployed with the following commands:

**Staging:**

```shell
docker-compose run --rm app npx deploy
```

**Production:**

```shell
docker-compose run --rm -e ARC_DEPLOY=production app npx deploy
```
