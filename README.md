# NoorAI

Powered by OpenAI, Nextjs, Mantine

## Setup

```shell
npm i ## yarn install, pnpm i
```

## Enviroment variables

- OPENAI_API_KEY: Get it from here [URL](https://platform.openai.com/account/api-keys)

For authentication you need one of them Google or GitHub
- GOOGLE_CLIENT_ID: [URL](https://cloud.google.com/docs/authentication/api-keys)
- GOOGLE_CLIENT_SECRET
- GITHUB_ID: [URL](https://github.com/settings/developers)
- GITHUB_SECRET

The easiest way to get DB url is create a project in Supabase and get it from project settings. 
- DATABASE_URL: []()

- NEXTAUTH_URL: "http://localhost:3000"
- NEXTAUTH_SECRET: run this command in your terminal `openssl rand -base64 32` and copy the string and past it into `.env` file
