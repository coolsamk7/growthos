import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig( {
    client: 'axios',
    input: 'http://localhost:3100/openapi.json',
    output: {
        path: './src/generated',
        format: 'prettier',
        lint: 'eslint',
    },
    types: {
        enums: 'javascript',
    },
    services: {
        asClass: true,
    },
} );
