import { useState, useEffect, useRef } from 'react';
import { getVideo } from '../services/dbService';

/**
 * Componente para reproduzir vídeos armazenados tanto no Firebase Storage quanto no IndexedDB
 * @param {Object} props
 * @param {string} props.videoUrl - URL do vídeo (pode ser Firebase URL ou IndexedDB URL)
 * @param {Object} props.className - Classes CSS para o elemento de vídeo
 * @param {Object} props.style - Estilos inline para o elemento de vídeo
 * @param {boolean} props.controls - Se deve mostrar controles de vídeo
 * @param {string} props.poster - URL da imagem de poster
 * @param {Function} props.onError - Callback de erro
 */
function VideoPlayer({
    videoUrl,
    className = "",
    style = {},
    controls = true,
    poster,
    onContextMenu,
    onError
}) {
    const [videoSrc, setVideoSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const loadVideo = async () => {
            if (!videoUrl) {
                setLoading(false);
                setError('URL de vídeo não fornecida');
                if (onError) onError('URL de vídeo não fornecida');
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Verificar se o vídeo está no Firebase Storage ou no IndexedDB
                if (videoUrl.startsWith('indexeddb://')) {
                    // Extrair o ID real
                    const dbVideoId = videoUrl.replace('indexeddb://', '');

                    // Recuperar o vídeo do IndexedDB
                    const videoData = await getVideo(dbVideoId);

                    if (!videoData) {
                        throw new Error('Vídeo não encontrado no banco de dados local');
                    }

                    // Definir a fonte para o player de vídeo
                    if (isMounted) {
                        setVideoSrc(videoData);
                        setLoading(false);
                    }
                } else {
                    // Para URLs do Firebase ou outras URLs externas, usar diretamente
                    if (isMounted) {
                        setVideoSrc(videoUrl);
                        setLoading(false);
                    }
                }
            } catch (err) {
                console.error('Erro ao carregar vídeo:', err);
                if (isMounted) {
                    setError(`Erro ao carregar vídeo: ${err.message}`);
                    setLoading(false);
                    if (onError) onError(err.message);
                }
            }
        };

        loadVideo();

        return () => {
            isMounted = false;
        };
    }, [videoUrl, onError]);

    if (loading) {
        return (
            <div className={`video-loading ${className}`} style={{ ...style, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`video-error ${className}`} style={{ ...style, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <div className="text-danger mb-2">⚠️</div>
                <p className="text-center text-danger">{error}</p>
            </div>
        );
    }

    return (
        <video
            ref={videoRef}
            src={videoSrc}
            className={className}
            style={style}
            controls={controls}
            poster={poster}
            onContextMenu={onContextMenu}
        />
    );
}

export default VideoPlayer; 