FROM node:20-slim

# Cria um diretório de trabalho para a aplicação dentro do container
WORKDIR /usr/src/app

# Copia APENAS os arquivos de dependência.
COPY package.json package-lock.json ./

# Instala todas as dependências do projeto
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# A porta que o serviço estará escutando.
EXPOSE 3005

# Define o comando de inicialização
CMD [ "npm", "start" ]