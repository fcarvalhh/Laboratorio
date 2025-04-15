import { useState, useEffect } from 'react';
import { getThumbnail } from '../services/dbService';

/**
 * Componente para exibir uma imagem thumbnail armazenada no IndexedDB
 * @param {Object} props
 * @param {string} props.thumbnailUrl - URL da thumbnail no formato "indexeddb-thumb://ID"
 * @param {string} props.alt - Texto alternativo
 * @param {string} props.className - Classes CSS para o elemento img
 * @param {Object} props.style - Estilos inline para o elemento img
 * @param {Function} props.onError - Callback para erro
 */
function ThumbnailImage({
    thumbnailUrl,
    alt = "Thumbnail",
    className = "",
    style = {},
    onError
}) {
    const [imgSrc, setImgSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadThumbnail = async () => {
            // Verificar se o ID da thumbnail está no formato correto
            if (!thumbnailUrl || !thumbnailUrl.startsWith('indexeddb-thumb://')) {
                setLoading(false);
                setError('Formato de URL de thumbnail inválido');
                if (onError) onError('Formato de URL de thumbnail inválido');
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Extrair o ID real
                const thumbnailId = thumbnailUrl.replace('indexeddb-thumb://', '');

                // Recuperar a thumbnail do IndexedDB
                const thumbnailData = await getThumbnail(thumbnailId);

                if (!thumbnailData) {
                    throw new Error('Thumbnail não encontrada no banco de dados');
                }

                // Definir a fonte para a imagem
                if (isMounted) {
                    setImgSrc(thumbnailData);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Erro ao carregar thumbnail:', err);
                if (isMounted) {
                    setError(`Erro ao carregar thumbnail: ${err.message}`);
                    setLoading(false);
                    if (onError) onError(err.message);
                }
            }
        };

        loadThumbnail();

        return () => {
            isMounted = false;
        };
    }, [thumbnailUrl, onError]);

    if (loading) {
        return (
            <div className={`thumbnail-loading ${className}`} style={{ ...style, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spinner-border spinner-border-sm text-secondary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    if (error || !imgSrc) {
        return (
            <div className={`thumbnail-error ${className}`} style={{ ...style, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
                <span className="text-muted">🖼️</span>
            </div>
        );
    }

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            style={style}
        />
    );
}

export default ThumbnailImage; 