// Configuração do Firebase
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase usando variáveis de ambiente
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase - tratamento para desenvolvimento
let app;
let storage;

try {
    // Verificar se as credenciais estão disponíveis
    if (!import.meta.env.VITE_FIREBASE_API_KEY ||
        import.meta.env.VITE_FIREBASE_API_KEY === 'sua-api-key') {
        console.warn(
            'ATENÇÃO: Credenciais do Firebase não configuradas! ' +
            'Para usar o armazenamento em nuvem, configure o arquivo .env com suas credenciais.'
        );
        // Em modo de desenvolvimento, podemos criar o app com configurações vazias
        app = initializeApp({
            apiKey: "dummy-key",
            authDomain: "dummy.firebaseapp.com",
            projectId: "dummy-project",
            storageBucket: "dummy.appspot.com",
            messagingSenderId: "000000000000",
            appId: "1:000000000000:web:0000000000000000000000"
        });
    } else {
        // Inicializar com as configurações reais
        app = initializeApp(firebaseConfig);
    }

    storage = getStorage(app);
} catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
    // Fallback para evitar quebrar a aplicação
    app = null;
    storage = null;
}

export { storage }; 