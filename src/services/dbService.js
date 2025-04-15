import { openDB } from 'idb';

const DB_NAME = 'videosDB';
const DB_VERSION = 1;
const VIDEO_STORE = 'videos';
const METADATA_STORE = 'metadata';

// Inicializa o banco de dados IndexedDB
const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Cria um object store para os arquivos de vídeo
            if (!db.objectStoreNames.contains(VIDEO_STORE)) {
                db.createObjectStore(VIDEO_STORE);
            }

            // Cria um object store para os metadados dos vídeos
            if (!db.objectStoreNames.contains(METADATA_STORE)) {
                const metadataStore = db.createObjectStore(METADATA_STORE, { keyPath: 'id' });
                metadataStore.createIndex('fileName', 'fileName', { unique: true });
                metadataStore.createIndex('order', 'order', { unique: false });
            }
        },
    });
};

/**
 * Converte um arquivo Blob/File para uma string base64 para armazenamento
 * @param {Blob} blob - O arquivo de vídeo
 * @returns {Promise<string>} - String base64 representando o arquivo
 */
const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

/**
 * Faz o upload de um arquivo de vídeo para o IndexedDB local
 * @param {File} file - O arquivo de vídeo a ser enviado
 * @param {string} videoId - ID único para o vídeo
 * @param {Function} progressCallback - Função para atualizar o progresso do upload
 * @returns {Promise<string>} - Um identificador para o vídeo armazenado
 */
export const uploadVideo = async (file, videoId, progressCallback) => {
    try {
        // Simular progresso para fornecer feedback ao usuário
        const simulateProgress = () => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                progressCallback(progress);
                if (progress >= 90) {
                    clearInterval(interval);
                }
            }, 200);
            return interval;
        };

        const progressInterval = simulateProgress();

        // Converter o arquivo para base64 (alternativa ao uso de Blob direto)
        const videoBase64 = await blobToBase64(file);

        // Armazenar no IndexedDB
        const db = await initDB();
        await db.put(VIDEO_STORE, videoBase64, videoId);

        // Limpar intervalo depois de completar o processamento
        clearInterval(progressInterval);
        progressCallback(100);

        // Retornar um URL de referência para o vídeo
        return `indexeddb://${videoId}`;
    } catch (error) {
        console.error('Erro ao armazenar vídeo:', error);
        throw error;
    }
};

/**
 * Recupera um vídeo do IndexedDB
 * @param {string} videoId - ID do vídeo
 * @returns {Promise<string>} - String base64 do vídeo
 */
export const getVideo = async (videoId) => {
    try {
        const db = await initDB();
        return await db.get(VIDEO_STORE, videoId);
    } catch (error) {
        console.error('Erro ao recuperar vídeo:', error);
        throw error;
    }
};

/**
 * Salva os metadados de um vídeo no IndexedDB
 * @param {Object} metadata - Metadados do vídeo
 * @returns {Promise<Object>} - Metadados salvos
 */
export const saveVideoMetadata = async (metadata) => {
    try {
        const db = await initDB();
        return await db.put(METADATA_STORE, metadata);
    } catch (error) {
        console.error('Erro ao salvar metadados:', error);
        throw error;
    }
};

/**
 * Recupera os metadados de todos os vídeos
 * @returns {Promise<Array>} - Array de metadados
 */
export const getAllVideosMetadata = async () => {
    try {
        const db = await initDB();
        return await db.getAll(METADATA_STORE);
    } catch (error) {
        console.error('Erro ao recuperar metadados:', error);
        throw error;
    }
};

/**
 * Recupera os metadados de um vídeo específico
 * @param {number} id - ID do vídeo
 * @returns {Promise<Object>} - Metadados do vídeo
 */
export const getVideoMetadataById = async (id) => {
    try {
        const db = await initDB();
        return await db.get(METADATA_STORE, Number(id));
    } catch (error) {
        console.error('Erro ao recuperar metadados do vídeo:', error);
        throw error;
    }
};

/**
 * Deleta um vídeo e seus metadados
 * @param {number} id - ID do vídeo
 * @returns {Promise<boolean>}
 */
export const deleteVideoWithMetadata = async (id) => {
    try {
        // Primeiro, vamos obter os metadados para saber o videoId
        const db = await initDB();
        const metadata = await db.get(METADATA_STORE, Number(id));

        if (!metadata) {
            console.warn(`Nenhum metadado encontrado para o ID ${id}`);
            return false;
        }

        // Extrair o ID do vídeo (que pode estar em videoId ou na URL)
        const videoStorageId = metadata.videoId ||
            (metadata.url && metadata.url.startsWith('indexeddb://')
                ? metadata.url.replace('indexeddb://', '')
                : null);

        if (!videoStorageId) {
            console.warn(`ID de armazenamento de vídeo não encontrado para ${id}`);
            // Mesmo que não encontremos o vídeo, ainda podemos excluir os metadados
        } else {
            // Excluir o vídeo do armazenamento
            await db.delete(VIDEO_STORE, videoStorageId);
            console.log(`Vídeo excluído do armazenamento: ${videoStorageId}`);
        }

        // Excluir os metadados
        await db.delete(METADATA_STORE, Number(id));
        console.log(`Metadados excluídos: ${id}`);

        return true;
    } catch (error) {
        console.error('Erro ao excluir vídeo:', error);
        throw error;
    }
}; 