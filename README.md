# Projeto de Restauração de Banco de Dados com PostgreSQL

Este repositório contém scripts e configurações para restaurar um banco de dados PostgreSQL a partir de um arquivo de backup. A principal funcionalidade é permitir a exclusão de schemas específicos durante a restauração.

## Pré-requisitos

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Passos para Utilização

### 1. Instalar Dependências

Após clonar o repositório, o primeiro passo é instalar todas as dependências necessárias. Isso pode ser feito utilizando o `yarn` ou `npm`:

```
yarn install
```
ou 
```
npm install
```

### 2. Gerar Arquivo de Conteúdo do Backup

Antes de executar o script principal, é necessário gerar um arquivo `.txt` contendo a lista de todos os objetos (tabelas, funções, etc.) presentes no backup. Isso pode ser feito com o comando `pg_restore`:

```
pg_restore -l -f contents.txt arquivo_backup.backup
```

O arquivo `contents.txt` será gerado e deve ser colocado na raiz do projeto.

### 3.Editar o Arquivo 

Abra o arquivo `index.ts` e remova ou adicione os schemas com interesse de excluir da restauração.

### 4. Executar o Script de Seleção de Schemas
Após editar e salvar o arquivo `index.ts`, execute o seguinte comando para gerar o arquivo `selectedSchema.txt`, que contém a lista de objetos os schemas comentados:

```
yarn start
```
ou 
```
npm start
```

### 5.Restaurar o Banco de Dados

Com o arquivo `selectedSchema.txt` gerado, você pode prosseguir com a restauração do banco de dados usando o `pg_restore`:

```
pg_restore -U postgres -d <nome_banco> -L selectedSchema.txt -v <arquivo_backup.backup>
```

Substitua `<nome_banco>` pelo nome do banco de dados de destino e `<arquivo_backup.backup>` pelo nome do arquivo de backup.