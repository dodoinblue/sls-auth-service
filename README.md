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

### nodejs
```
env $(cat path/to/.env) npm run start:dev
```

## API doc
1. Run `env $(cat path/to/.env) npm run start:dev`
2. Visit `http://localhost:3000/auth/docs/v1/`

## Deploy
### AWS
```
sls deploy --stage yourStage --aws-profile yourAwsProfile
```

## Goal
- [x] Create account
- [x] Login with username/password
- [x] Login with refresh token
- [x] Issue token with roles
- [ ] Verify email / phone number
- [x] Reset password flow
- [x] Account Info CRUD
- [x] Roles CRUD
- [ ] DynamoDB integration
- [ ] Test coverage
- [ ] Docker image
- [ ] Heroku
- [ ] Create account with invitation code
- [ ] Wechat/Apple/Google/Facebook/Alipay auth flow