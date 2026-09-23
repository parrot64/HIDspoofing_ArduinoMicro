import js from "@eslint/js";
import globals from "globals";
import { defineConfig, } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.js",],
        languageOptions: {sourceType: "commonjs",},
    },
    {
        languageOptions:
        {
            globals:
            {
                process: "readonly",
                __dirname: "readonly",
                Buffer: "readonly",
                URLSearchParams: "readonly",
                TextDecoder: "readonly",
                console: "readonly",
                document: "readonly",
                fetch: "readonly",
                Blob: "readonly",
                URL: "readonly",
            },
        },
    },
    js.configs.recommended,
    {
        rules:
        {
            'key-spacing': ["error", { "beforeColon": false, },],
            "object-shorthand": ["off",],
            'brace-style': ['error', 'allman',],
            'eol-last': ["error", "always",],
            indent:
            [
                'error', 4,
                {
                    outerIIFEBody: 1,
                    FunctionExpression: { body: 1, parameters: 2, },
                    SwitchCase: 1,
                },
            ],
            'no-unused-vars': ['off', { vars: 'local', },],
            'no-multi-spaces': ['off',],
            'no-trailing-spaces': "error",
            quotes: ["off",],
            "space-before-function-paren": ["off",],
            "comma-dangle":
            [
                "error",
                {
                    arrays: "always",
                    objects: "always",
                    imports: "always",
                    exports: "always",
                    functions: "never",
                },
            ],
            "keyword-spacing":
            [
                "error",
                {
                    overrides:
                    {
                        catch: { after: false, },
                    },
                },
            ],
        },
    },

]);
