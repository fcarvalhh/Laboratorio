const videos = [];

let videoIdCounter = 1;

export const getVideos = () => {
    return [...videos].sort((a, b) => a.order - b.order);
};

export const getVideoById = (id) => {
    return videos.find(video => video.id === Number(id));
};

export const addVideo = (video) => {
    // Verifica se já existe um vídeo com o mesmo nome de arquivo
    const existingVideo = videos.find(v => v.fileName === video.fileName);
    if (existingVideo) {
        console.warn(`Vídeo com o nome de arquivo "${video.fileName}" já existe. Upload ignorado.`);
        // Retorna o vídeo existente ou null para indicar que nada foi adicionado
        // Escolha o que fizer mais sentido para a lógica de UI em VideoUpload.jsx
        // Por agora, retornaremos null para evitar adicionar duplicatas.
        return null;
    }

    // Em uma implementação real, isso seria uma chamada para API
    const newVideo = {
        ...video,
        id: videoIdCounter++,
        timestamp: new Date().toISOString()
    };

    videos.push(newVideo);
    return newVideo;
};

export const updateVideo = (id, updatedData) => {
    const index = videos.findIndex(video => video.id === Number(id));
    if (index !== -1) {
        videos[index] = {
            ...videos[index],
            ...updatedData,
            lastUpdated: new Date().toISOString()
        };
        return videos[index];
    }
    return null;
};

export const deleteVideo = (id) => {
    const index = videos.findIndex(video => video.id === Number(id));
    if (index !== -1) {
        const deletedVideo = videos[index];
        videos.splice(index, 1);
        return deletedVideo;
    }
    return null;
};

export default videos; 