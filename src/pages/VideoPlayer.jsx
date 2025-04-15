import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap'
import { getVideoById, getVideos } from '../data/videos'
import VideoPlayer from '../components/VideoPlayer'
import ThumbnailImage from '../components/ThumbnailImage'

function VideoPlayerPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [video, setVideo] = useState(null)
    const [relatedVideos, setRelatedVideos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // Função para bloquear o menu de contexto (clique com botão direito)
    const handleRightClick = (e) => {
        e.preventDefault();
        return false;
    }

    useEffect(() => {
        const fetchVideo = async () => {
            setIsLoading(true)
            setError(null)
            try {
                // Simulando um delay de rede
                await new Promise(resolve => setTimeout(resolve, 300))

                const videoData = await getVideoById(id)

                if (!videoData) {
                    setVideo(null)
                    setIsLoading(false)
                    return
                }

                setVideo(videoData)

                // Buscar vídeos relacionados (excluindo o atual)
                const allVideos = await getVideos()
                const related = allVideos.filter(v => v.id !== Number(id)).slice(0, 3)
                setRelatedVideos(related)
            } catch (error) {
                console.error('Erro ao carregar vídeo:', error)
                setError("Não foi possível carregar o vídeo. Tente novamente mais tarde.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchVideo()
    }, [id])

    const handleVideoError = (errorMsg) => {
        console.error('Erro no player de vídeo:', errorMsg);
        setError(`Erro ao reproduzir o vídeo: ${errorMsg}`);
    }

    const handleThumbnailError = (errorMsg) => {
        console.error('Erro na thumbnail:', errorMsg);
        // Não exibimos mensagem de erro para o usuário, apenas logamos
    }

    if (isLoading) {
        return (
            <Container className="py-4 text-center">
                <Spinner animation="border" variant="primary" />
            </Container>
        )
    }

    if (error) {
        return (
            <Container className="py-4">
                <Alert variant="danger" className="text-center p-4">
                    <div className="fs-1 mb-3">⚠️</div>
                    <h2 className="h4 fw-bold mb-3">Erro</h2>
                    <p className="mb-4">{error}</p>
                    <Button variant="primary" onClick={() => window.location.reload()}>
                        Tentar novamente
                    </Button>
                </Alert>
            </Container>
        )
    }

    if (!video) {
        return (
            <Container className="py-4">
                <Alert variant="warning" className="text-center p-4">
                    <div className="fs-1 mb-3">⚠️</div>
                    <h2 className="h4 fw-bold mb-3">Vídeo não encontrado</h2>
                    <p className="mb-4">O vídeo que você está procurando não existe ou foi removido.</p>
                    <Link to="/videos">
                        <Button variant="primary">Voltar para a biblioteca</Button>
                    </Link>
                </Alert>
            </Container>
        )
    }

    return (
        <Container className="py-4">
            <Link
                to="/videos"
                className="d-flex align-items-center text-decoration-none mb-3"
            >
                <span className="me-1">←</span> Voltar para a biblioteca
            </Link>

            <Card className="mb-4 shadow-sm overflow-hidden">
                <div className="player-container">
                    {video.url ? (
                        <VideoPlayer
                            videoUrl={video.url}
                            className="w-100 h-100"
                            style={{ objectFit: 'contain' }}
                            controls={true}
                            poster={video.thumbnailUrl}
                            onContextMenu={handleRightClick}
                            onError={handleVideoError}
                        />
                    ) : (
                        <div className="text-center">
                            <div className="fs-1 mb-3">🎬</div>
                            <p className="mb-3">{video.title}</p>
                            <p className="text-muted small">URL do vídeo não disponível</p>
                        </div>
                    )}
                </div>

                <Card.Body>
                    <div className="d-flex align-items-start mb-3">
                        {video.thumbnailUrl && (
                            <div className="me-3 rounded border" style={{ width: '100px', height: '75px', overflow: 'hidden', flexShrink: 0 }}>
                                <ThumbnailImage
                                    thumbnailUrl={video.thumbnailUrl}
                                    alt={`Thumbnail para ${video.title}`}
                                    className="w-100 h-100"
                                    style={{ objectFit: 'cover' }}
                                    onError={handleThumbnailError}
                                />
                            </div>
                        )}
                        <div>
                            <h1 className="h3 fw-bold mb-2">{video.title}</h1>
                            <div className="text-muted small mb-3">
                                {video.fileName && <div>Arquivo: {video.fileName}</div>}
                                {video.order && <div>Ordem: {video.order}</div>}
                                {video.timestamp && <div>Adicionado em: {new Date(video.timestamp).toLocaleString()}</div>}
                                {video.lastUpdated && <div>Última atualização: {new Date(video.lastUpdated).toLocaleString()}</div>}
                            </div>
                        </div>
                    </div>

                    <hr className="my-3" />
                    <h2 className="h5 fw-bold mb-2">Descrição</h2>
                    <p className="text-secondary">{video.description || "Sem descrição"}</p>
                    <div className="mt-4 d-flex justify-content-end">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => navigate(`/videos`)}
                        >
                            Voltar para biblioteca
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {relatedVideos.length > 0 && (
                <Card className="shadow-sm">
                    <Card.Body>
                        <h2 className="h5 fw-bold mb-3">Vídeos relacionados</h2>
                        <Row xs={1} sm={2} md={3} className="g-3">
                            {relatedVideos.map(related => (
                                <Col key={related.id}>
                                    <Link
                                        to={`/videos/${related.id}`}
                                        className="text-decoration-none"
                                    >
                                        <div className="d-flex p-2 border rounded hover-bg-light">
                                            <div className="video-thumbnail rounded me-2" style={{ width: '4rem', height: '3rem', overflow: 'hidden' }}>
                                                {related.thumbnailUrl ? (
                                                    <ThumbnailImage
                                                        thumbnailUrl={related.thumbnailUrl}
                                                        alt={`Thumbnail para ${related.title}`}
                                                        className="w-100 h-100"
                                                        style={{ objectFit: 'cover' }}
                                                        onError={handleThumbnailError}
                                                    />
                                                ) : (
                                                    <div className="w-100 h-100 bg-light d-flex justify-content-center align-items-center">
                                                        <span className="fs-6">🎬</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-dark fw-medium small">{related.title}</div>
                                                <div className="text-muted x-small">
                                                    {related.order && `Ordem: ${related.order}`}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>
            )}
        </Container>
    )
}

export default VideoPlayerPage 