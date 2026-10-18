@echo off
rem Abre o site da Festolândia Natal Encantado no navegador (servidor local na porta 3084).
cd /d "%~dp0"
start "" http://localhost:3084
node scripts\serve.mjs 3084
