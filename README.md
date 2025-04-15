# 55-jam-Video

Uma plataforma simples para upload e visualização de vídeos, desenvolvida com React e Vite.

## Funcionalidades

*   Upload de vídeos (com título, descrição e ordem de exibição).
*   Armazenamento local dos vídeos usando IndexedDB.
*   Preview do vídeo durante o upload.
*   Barra de progresso para o upload.
*   Tratamento para evitar uploads duplicados (baseado no nome do arquivo).
*   Listagem dos vídeos enviados.
*   Visualização individual de vídeos.
*   Interface responsiva utilizando React Bootstrap.

## Stack de Tecnologias

*   **Frontend:** React, Vite, React Bootstrap, JavaScript
*   **Estilização:** CSS (com classes do Bootstrap e CSS customizado)
*   **Armazenamento:** IndexedDB para vídeos (armazenamento local no navegador)
*   **Persistência Local:** IndexedDB para metadados dos vídeos

## Começando

Siga estas instruções para configurar e rodar o projeto localmente.

### Pré-requisitos

*   Node.js (versão 18 ou superior recomendada)
*   npm ou yarn
*   Navegador moderno com suporte a IndexedDB (Chrome, Firefox, Safari, Edge)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone <url-do-repositorio>
    ```
2.  Navegue até o diretório do projeto:
    ```bash
    cd 55-jam-video
    ```
3.  Instale as dependências necessarias:
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

Este projeto é uma aplicação frontend para gerenciar uma coleção de vídeos.

**Funcionalidades Implementadas:**
*   Upload de arquivos de vídeo para armazenamento local no navegador (IndexedDB).
*   Gerenciamento básico de metadados (título, descrição, ordem).
*   Persistência local dos metadados e arquivos dos vídeos.
*   Listagem e visualização dos vídeos.
*   Prevenção de upload de vídeos com nomes de arquivo idênticos.

**Características Técnicas:**
*   Os vídeos são armazenados no IndexedDB do navegador.
*   Suporte para vídeos de até 50MB (limitação do IndexedDB).
*   Os metadados dos vídeos são armazenados no mesmo banco de dados IndexedDB.
*   O upload simula o progresso e converte o vídeo para base64 para armazenamento.
*   Os dados persistem entre sessões do mesmo navegador e dispositivo.

**Limitações:**
*   Os vídeos são armazenados apenas localmente no navegador do usuário.
*   O conteúdo não é compartilhado entre diferentes navegadores ou dispositivos.
*   Há limite de tamanho para os vídeos (50MB).
*   Não há autenticação de usuário.
*   O player de vídeo é o player padrão do navegador.

Este projeto serve como um exemplo funcional de uma plataforma de vídeo com armazenamento local no navegador.
