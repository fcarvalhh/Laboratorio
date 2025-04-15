# Plataforma de Compartilhamento de Vídeos

Uma aplicação web para upload e visualização de vídeos, com armazenamento persistente através do Firebase Storage.

## Requisitos

- Node.js 14+ 
- NPM ou Yarn
- Conta no Firebase (gratuita)

## Configuração do Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/) e crie um novo projeto
2. Navegue até "Storage" no menu lateral e clique em "Começar"
3. Escolha o modo de segurança (recomendado: "Iniciar no modo de teste")
4. Selecione o local de armazenamento mais próximo de seus usuários
5. No painel lateral, clique em "Project Overview" e adicione um aplicativo web (ícone </>) 
6. Dê um nome ao aplicativo e registre-o
7. Copie as informações de configuração fornecidas:

```javascript
const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx"
};
```

8. Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-messaging-sender-id
VITE_FIREBASE_APP_ID=seu-app-id
```

## Configuração das Regras de Segurança do Firebase Storage

Por padrão, o Firebase Storage restringirá o acesso após um período inicial. Para permitir acesso público de leitura e escrita em produção, configure as regras do Storage:

1. No console do Firebase, navegue até "Storage" > "Rules"
2. Configure as regras para permitir acesso:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Permitir leitura para todos
      allow read: if true;
      
      // Permitir escrita para todos (para seu protótipo)
      allow write: if true;
      
      // Em um ambiente de produção real, você deve usar 
      // regras mais restritivas, como autenticação:
      // allow write: if request.auth != null;
    }
  }
}
```

3. Clique em "Publicar"

## Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Configure o Firebase conforme as instruções acima
4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Implantação na Netlify

1. Crie uma conta na [Netlify](https://www.netlify.com/)
2. Conecte seu repositório Git
3. Configure as variáveis de ambiente com as informações do Firebase:
   - Vá para Site Settings > Build & Deploy > Environment
   - Adicione todas as variáveis do arquivo `.env`
4. Faça deploy do site

## Funcionalidades

- Upload de vídeos até 100MB
- Upload de thumbnails para os vídeos
- Reprodução de vídeos
- Organização por ordem de exibição
- Armazenamento persistente no Firebase Storage

## Limitações do Firebase Storage Gratuito

- Armazenamento: 5GB
- Transferência: 1GB/dia
- Operações de gravação: 20.000/dia
- Operações de leitura: 50.000/dia

## Estrutura do Projeto

- `/src`: Código fonte da aplicação
  - `/components`: Componentes React
  - `/config`: Configurações (Firebase, etc.)
  - `/data`: Gerenciamento de dados
  - `/pages`: Páginas da aplicação
  - `/services`: Serviços para interação com APIs
  
## Solução de Problemas

### Os vídeos não aparecem após upload

- Verifique se as credenciais do Firebase estão configuradas corretamente
- Verifique as regras de segurança do Firebase Storage
- Verifique o console do navegador para erros específicos

### Erros de CORS no Firebase Storage

Se você encontrar erros de CORS:

1. No Console do Firebase, vá para Storage > Reglas
2. Certifique-se de que as regras permitam acesso de leitura
3. Configure o cabeçalho CORS no Console do Google Cloud para o seu bucket
