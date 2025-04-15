import { openDB } from 'idb';

const DB_NAME = 'videosDB';
const DB_VERSION = 2;
const VIDEO_STORE = 'videos';
const METADATA_STORE = 'metadata';
const THUMBNAIL_STORE = 'thumbnails';

// Inicializa o banco de dados IndexedDB
const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion, transaction) {
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

            // Cria um object store para as thumbnails
            if (!db.objectStoreNames.contains(THUMBNAIL_STORE)) {
                db.createObjectStore(THUMBNAIL_STORE);
            }
        },
    });
};

/**
 * Converte um arquivo Blob/File para uma string base64 para armazenamento
 * @param {Blob} blob - O arquivo de vídeo ou imagem
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
 * Faz o upload de uma imagem de thumbnail para o IndexedDB
 * @param {File} file - A imagem thumbnail a ser enviada
 * @param {string} thumbnailId - ID único para a thumbnail
 * @returns {Promise<string>} - Um identificador para a thumbnail armazenada
 */
export const uploadThumbnail = async (file, thumbnailId) => {
    try {
        // Verificar se é uma imagem
        if (!file.type.startsWith('image/')) {
            throw new Error('O arquivo não é uma imagem válida');
        }

        // Limitar o tamanho da imagem (2MB)
        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            throw new Error(`A imagem é muito grande (${(file.size / (1024 * 1024)).toFixed(2)}MB). O tamanho máximo é 2MB.`);
        }

        // Converter a imagem para base64
        const imageBase64 = await blobToBase64(file);

        // Armazenar no IndexedDB
        const db = await initDB();
        await db.put(THUMBNAIL_STORE, imageBase64, thumbnailId);

        // Retornar um URL de referência para a thumbnail
        return `indexeddb-thumb://${thumbnailId}`;
    } catch (error) {
        console.error('Erro ao armazenar thumbnail:', error);
        throw error;
    }
};

/**
 * Recupera uma thumbnail do IndexedDB
 * @param {string} thumbnailId - ID da thumbnail
 * @returns {Promise<string>} - String base64 da thumbnail
 */
export const getThumbnail = async (thumbnailId) => {
    try {
        const db = await initDB();
        return await db.get(THUMBNAIL_STORE, thumbnailId);
    } catch (error) {
        console.error('Erro ao recuperar thumbnail:', error);
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

        // Extrair o ID do vídeo e da thumbnail
        const videoStorageId = metadata.videoId ||
            (metadata.url && metadata.url.startsWith('indexeddb://')
                ? metadata.url.replace('indexeddb://', '')
                : null);

        const thumbnailStorageId = metadata.thumbnailId ||
            (metadata.thumbnailUrl && metadata.thumbnailUrl.startsWith('indexeddb-thumb://')
                ? metadata.thumbnailUrl.replace('indexeddb-thumb://', '')
                : null);

        // Excluir o vídeo do armazenamento
        if (videoStorageId) {
            await db.delete(VIDEO_STORE, videoStorageId);
            console.log(`Vídeo excluído do armazenamento: ${videoStorageId}`);
        }

        // Excluir a thumbnail se existir
        if (thumbnailStorageId) {
            await db.delete(THUMBNAIL_STORE, thumbnailStorageId);
            console.log(`Thumbnail excluída do armazenamento: ${thumbnailStorageId}`);
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