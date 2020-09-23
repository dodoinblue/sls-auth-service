# Serverless Auth

## Setup DB
1. Create a `.env` file that contains following
```
DB_HOST=localhost
DB_USER=test
DB_PASSWORD=test
DB_SCHEMA=test
JWT_SECRET=secret
REFRESH_TOKEN_ENCRYPT_SECRET=notsafe
```
2. Run migration command
```
env $(cat ./path/to/.env) npm run db:migrate
```

## Run
### serverless offline
```
sls offline --prefix auth --noPrependStageInUrl
```

## Goal
- [ ] Create account
- [ ] Create account with invitation code
- [ ] Verify email / phone number
- [ ] Issue token with customized fields
- [ ] Auth code flow
- [ ] Multiple tenant