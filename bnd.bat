@echo off
npm run build
set NODE_ENV=production
npm run start:prod
