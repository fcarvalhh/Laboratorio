# 55-jam-Video

Uma plataforma simples para upload e visualização de vídeos, desenvolvida com React e Vite.

## Funcionalidades

*   Upload de vídeos (com título, descrição e ordem de exibição).
*   Preview do vídeo durante o upload.
*   Barra de progresso para o upload.
*   Tratamento para evitar uploads duplicados (baseado no nome do arquivo).
*   Listagem dos vídeos enviados.
*   Visualização individual de vídeos.
*   Interface responsiva utilizando React Bootstrap.

## Stack de Tecnologias

*   **Frontend:** React, Vite, React Bootstrap, JavaScript
*   **Estilização:** CSS (com classes do Bootstrap e CSS customizado)
*   **Dados:** Mock data em memória (sem persistência real em banco de dados)

## Começando

Siga estas instruções para configurar e rodar o projeto localmente.

### Pré-requisitos

*   Node.js (versão 18 ou superior recomendada)
*   npm ou yarn

### Instalação

1.  Clone o repositório:
    ```bash
    git clone <url-do-repositorio>
    ```
2.  Navegue até o diretório do projeto:
    ```bash
    cd 55-jam-video
    ```
3.  Instale as dependências:
    ```bash
    npm install
    # ou
    yarn install
    ```

### Rodando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:5173](http://localhost:5173) (ou a porta indicada no terminal) no seu navegador para ver a aplicação.

## Escopo do Projeto

Este projeto é uma aplicação frontend focada na interface do usuário para gerenciar uma coleção de vídeos. 

**Funcionalidades Implementadas:**
*   Upload de arquivos de vídeo.
*   Gerenciamento básico de metadados (título, descrição, ordem).
*   Listagem e visualização dos vídeos.
*   Prevenção de upload de vídeos com nomes de arquivo idênticos.

**Fora do Escopo:**
*   Não há um backend real ou banco de dados. Os dados dos vídeos são armazenados em memória e perdidos ao recarregar a aplicação (`src/data/videos.js`).
*   Não há autenticação de usuário.
*   O player de vídeo é o player padrão do navegador.
*   Não há processamento ou transcodificação de vídeo no lado do servidor.

Este projeto serve como um exemplo ou ponto de partida para uma plataforma de vídeo mais completa.
