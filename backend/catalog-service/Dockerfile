# Usa uma imagem base oficial para Node.js (ou a linguagem do seu serviço)
FROM node:20-slim

# Cria o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de configuração de dependências
COPY package.json package-lock.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta que o serviço estará escutando
EXPOSE 3004

# Define o comando que será executado quando o container iniciar
CMD [ "npm", "start" ]