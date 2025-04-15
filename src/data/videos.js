import {
    getAllVideosMetadata,
    getVideoMetadataById,
    saveVideoMetadata,
    deleteVideoWithMetadata
} from '../services/dbService';

// Manter uma cópia em memória para operações rápidas
let videos = [];
let videoIdCounter = 1;
let initialized = false;

// Inicializa os vídeos a partir do IndexedDB
const initVideos = async () => {
    if (initialized) return;

    try {
        // Carregar metadados do IndexedDB
        const storedVideos = await getAllVideosMetadata();
        videos = storedVideos || [];

        // Atualizar o contador de IDs
        videoIdCounter = videos.length > 0
            ? Math.max(...videos.map(video => video.id)) + 1
            : 1;

        initialized = true;
    } catch (error) {
        console.error('Erro ao inicializar vídeos:', error);
        videos = [];
        videoIdCounter = 1;
    }
};

// Garantir que os vídeos sejam inicializados
initVideos();

export const getVideos = async () => {
    await initVideos();
    return [...videos].sort((a, b) => a.order - b.order);
};

export const getVideoById = async (id) => {
    await initVideos();
    return videos.find(video => video.id === Number(id));
};

export const addVideo = async (video) => {
    await initVideos();

    // Verifica se já existe um vídeo com o mesmo nome de arquivo
    const existingVideo = videos.find(v => v.fileName === video.fileName);
    if (existingVideo) {
        console.warn(`Vídeo com o nome de arquivo "${video.fileName}" já existe. Upload ignorado.`);
        return null;
    }

    // Criar novo vídeo com ID incremental
    const newVideo = {
        ...video,
        id: videoIdCounter++,
        timestamp: new Date().toISOString()
    };

    // Adicionar à lista em memória
    videos.push(newVideo);

    // Salvar metadados no IndexedDB
    try {
        await saveVideoMetadata(newVideo);
        return newVideo;
    } catch (error) {
        console.error('Erro ao salvar metadados do vídeo:', error);
        // Remover da lista em caso de erro
        videos = videos.filter(v => v.id !== newVideo.id);
        throw error;
    }
};

export const updateVideo = async (id, updatedData) => {
    await initVideos();

    const index = videos.findIndex(video => video.id === Number(id));
    if (index !== -1) {
        const updatedVideo = {
            ...videos[index],
            ...updatedData,
            lastUpdated: new Date().toISOString()
        };

        videos[index] = updatedVideo;

        // Persistir as alterações no IndexedDB
        try {
            await saveVideoMetadata(updatedVideo);
            return updatedVideo;
        } catch (error) {
            console.error('Erro ao atualizar metadados do vídeo:', error);
            throw error;
        }
    }
    return null;
};

export const deleteVideo = async (id) => {
    await initVideos();

    const numericId = Number(id);
    const index = videos.findIndex(video => video.id === numericId);

    if (index === -1) {
        console.warn(`Tentativa de excluir vídeo inexistente com ID ${id}`);
        return null;
    }

    const deletedVideo = videos[index];

    try {
        // Primeiro tentar excluir do IndexedDB
        const result = await deleteVideoWithMetadata(numericId);

        if (result) {
            // Se bem-sucedido, remover da lista em memória
            videos.splice(index, 1);
            console.log(`Vídeo com ID ${numericId} excluído com sucesso`);
            return deletedVideo;
        } else {
            throw new Error(`Não foi possível excluir o vídeo ${numericId} do banco de dados`);
        }
    } catch (error) {
        console.error(`Erro ao excluir vídeo ${numericId}:`, error);
        throw new Error(`Falha ao excluir vídeo: ${error.message}`);
    }
};

export default { getVideos, getVideoById, addVideo, updateVideo, deleteVideo }; 