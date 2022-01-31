# Social Picker Vue.js

Frontend client built for [Social Picker API](https://github.com/serguun42/Social-Picker-API).

1. Install only necessary npm dependencies – `npm i --production`
2. Change variables in [`production.env`](./src/config/production.env)
3. Build static Redoc API based on [`api.yml`](./public/docs/api.yml) – `npm run generate-openapi-redoc`
4. Build with Vue & Webpack – `npm run build`
5. Move built folder `dist` to accessible public folder


### Additional/dev only commands
* Generate OpenAPI components based on Typescript types (located in `src/types`)
	1. `npm i -D ts-to-openapi`
	2. `npm run generate-openapi-types`
