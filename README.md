# Projeto de Restauração de Banco de Dados com PostgreSQL

Este repositório é um script para automatizar a restauração de um banco de dados PostgreSQL a partir de um arquivo .backup. A principal funcionalidade é restaurar schemas e tabelas específicas por meio de um filtro de exclusão.

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

### 2. Editar Filtro

Antes de executar o script para restaurar o banco de dados, descompacte o arquivo zipado e, em seguida, acesse o arquivo `index.ts`. Modifique os valores de acordo com a configuração da sua plataforma no objeto `config`:

```
export const config = {
    backupFilePath: "/home/compels/Downloads/compels_mr_2024-08-14_22_05.backup",
    preDataPath: "./pgArchive/pre_data.txt",
    dataPath: "./pgArchive/data.txt",
    postPath: "./pgArchive/post_data.txt",

    nomeBanco: "compels_mr",
    schemasList: ["cpdv", "crm", "dominio", "ecommerce", "kikker", "messaging", "otrs", "pci", "pcp", "rdstation", "rec", "transp", "tray", "vipcommerce"],
    codigoLoja: "mr",
    lojaList: ["mr01", "mr02", "mr04", "mr06", "mr18"],
}

```

Configurações:

- backupFilePath: A localização do arquivo .backup.
- preDataPath, dataPath, postPath: O local onde serão guardados os arquivos de script pg_restore (recomendado não alterar, a menos que OS exija).
- nomeBanco: O nome do banco a ser restaurado.
- schemasList: Lista de schemas ou apenas nomes de tabelas a serem excluídas da restauração.
- codigoLoja: Parâmetro não obrigatório, mas útil caso o banco de dados seja particionado e você deseje restaurar uma loja específica.
- lojaList: Parâmetro não obrigatório, Array de strings contendo o código e número da loja.

### 3. Executar o Script de Restauração BD
Após editar e salvar o arquivo `index.ts`, execute o seguinte:

```
yarn start
```
ou 
```
npm start
```