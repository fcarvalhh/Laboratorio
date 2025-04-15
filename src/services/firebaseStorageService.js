import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Faz o upload de um vídeo para o Firebase Storage
 * @param {File} file - O arquivo de vídeo a ser enviado
 * @param {string} videoId - ID único para o vídeo
 * @param {Function} progressCallback - Função para atualizar o progresso do upload
 * @returns {Promise<string>} - Uma URL para o vídeo armazenado
 */
export const uploadVideoToFirebase = async (file, videoId, progressCallback) => {
    try {
        // Criar uma referência para o vídeo no Firebase Storage
        const videoRef = ref(storage, `videos/${videoId}`);

        // Iniciar o upload
        const uploadTask = uploadBytesResumable(videoRef, file);

        // Retornar uma Promise que resolve quando o upload estiver completo
        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Calcular o progresso
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    // Atualizar o callback de progresso
                    if (progressCallback) progressCallback(progress);
                },
                (error) => {
                    // Rejeitar em caso de erro
                    console.error('Erro ao fazer upload para o Firebase:', error);
                    reject(error);
                },
                async () => {
                    // Upload completo, obter a URL de download
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        console.error('Erro ao obter URL de download:', error);
                        reject(error);
                    }
                }
            );
        });
    } catch (error) {
        console.error('Erro ao preparar upload para o Firebase:', error);
        throw error;
    }
};

/**
 * Faz o upload de uma imagem de thumbnail para o Firebase Storage
 * @param {File} file - A imagem thumbnail a ser enviada
 * @param {string} thumbnailId - ID único para a thumbnail
 * @param {Function} progressCallback - Opcional: Função para atualizar o progresso do upload
 * @returns {Promise<string>} - Uma URL para a thumbnail armazenada
 */
export const uploadThumbnailToFirebase = async (file, thumbnailId, progressCallback) => {
    try {
        // Validar se é uma imagem
        if (!file.type.startsWith('image/')) {
            throw new Error('O arquivo não é uma imagem válida');
        }

        // Limitar o tamanho (2MB)
        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            throw new Error(`A imagem é muito grande (${(file.size / (1024 * 1024)).toFixed(2)}MB). O tamanho máximo é 2MB.`);
        }

        // Criar referência para a thumbnail
        const thumbnailRef = ref(storage, `thumbnails/${thumbnailId}`);

        // Iniciar o upload
        const uploadTask = uploadBytesResumable(thumbnailRef, file);

        // Retornar uma Promise que resolve quando o upload estiver completo
        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Calcular o progresso
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    // Atualizar o callback de progresso, se fornecido
                    if (progressCallback) progressCallback(progress);
                },
                (error) => {
                    // Rejeitar em caso de erro
                    console.error('Erro ao fazer upload de thumbnail para o Firebase:', error);
                    reject(error);
                },
                async () => {
                    // Upload completo, obter a URL de download
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        console.error('Erro ao obter URL de download da thumbnail:', error);
                        reject(error);
                    }
                }
            );
        });
    } catch (error) {
        console.error('Erro ao preparar upload de thumbnail para o Firebase:', error);
        throw error;
    }
};

/**
 * Exclui um vídeo do Firebase Storage
 * @param {string} videoUrl - URL do vídeo a ser excluído
 * @returns {Promise<boolean>} - Sucesso da operação
 */
export const deleteVideoFromFirebase = async (videoUrl) => {
    try {
        // Criar referência para o vídeo a partir da URL
        const videoRef = ref(storage, videoUrl);

        // Excluir o objeto
        await deleteObject(videoRef);

        return true;
    } catch (error) {
        console.error('Erro ao excluir vídeo do Firebase:', error);
        throw error;
    }
};

/**
 * Exclui uma thumbnail do Firebase Storage
 * @param {string} thumbnailUrl - URL da thumbnail a ser excluída
 * @returns {Promise<boolean>} - Sucesso da operação
 */
export const deleteThumbnailFromFirebase = async (thumbnailUrl) => {
    try {
        // Criar referência para a thumbnail a partir da URL
        const thumbnailRef = ref(storage, thumbnailUrl);

        // Excluir o objeto
        await deleteObject(thumbnailRef);

        return true;
    } catch (error) {
        console.error('Erro ao excluir thumbnail do Firebase:', error);
        throw error;
    }
}; 