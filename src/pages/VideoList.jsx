import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Spinner, Button, Modal, Form } from 'react-bootstrap'
import { getVideos, updateVideo, deleteVideo } from '../data/videos'
import ThumbnailImage from '../components/ThumbnailImage'

function VideoList() {
    const [videos, setVideos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [currentVideo, setCurrentVideo] = useState(null)
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        order: ''
    })

    const fetchVideos = async () => {
        setIsLoading(true)
        setError(null)
        try {
            // Delay simulado de 500ms
            await new Promise(resolve => setTimeout(resolve, 300))
            const data = await getVideos()
            setVideos(data)
        } catch (error) {
            console.error('Erro ao carregar vídeos:', error)
            setError("Não foi possível carregar os vídeos. Tente novamente mais tarde.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchVideos()
    }, [])

    const handleEditClick = (video) => {
        setCurrentVideo(video)
        setEditForm({
            title: video.title,
            description: video.description,
            order: video.order || ''
        })
        setShowEditModal(true)
    }

    const handleDeleteClick = (video) => {
        setCurrentVideo(video)
        setShowDeleteModal(true)
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        if (currentVideo) {
            try {
                await updateVideo(currentVideo.id, {
                    title: editForm.title,
                    description: editForm.description,
                    order: editForm.order !== '' ? parseInt(editForm.order) : currentVideo.order
                })
                setShowEditModal(false)
                fetchVideos()
            } catch (error) {
                console.error('Erro ao atualizar vídeo:', error)
                alert('Não foi possível atualizar o vídeo. Tente novamente.')
            }
        }
    }

    const handleDeleteConfirm = async () => {
        if (!currentVideo) return;

        try {
            setIsLoading(true);
            await deleteVideo(currentVideo.id);
            setShowDeleteModal(false);
            fetchVideos();
            // Mostrar mensagem de sucesso temporária
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
            successMessage.style.zIndex = '9999';
            successMessage.innerHTML = `<strong>Sucesso!</strong> Vídeo "${currentVideo.title}" excluído.`;
            document.body.appendChild(successMessage);
            setTimeout(() => document.body.removeChild(successMessage), 3000);
        } catch (error) {
            console.error('Erro ao excluir vídeo:', error);
            setShowDeleteModal(false);

            // Criar uma mensagem de erro mais detalhada
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
            errorMessage.style.zIndex = '9999';
            errorMessage.innerHTML = `<strong>Erro ao excluir vídeo:</strong> ${error.message}`;
            document.body.appendChild(errorMessage);
            setTimeout(() => document.body.removeChild(errorMessage), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <Container className="py-5">
                <h1 className="display-5 mb-4 fw-bold text-primary">Biblioteca de Vídeos</h1>
                <Card className="border-0 shadow text-center p-5 rounded-3">
                    <div className="fs-1 mb-3 text-danger">⚠️</div>
                    <h2 className="h4 fw-bold text-danger mb-3">Erro</h2>
                    <p className="text-muted mb-4">{error}</p>
                    <div className="d-flex justify-content-center">
                        <Button variant="primary" onClick={fetchVideos} className="px-4 py-2 rounded-pill">
                            Tentar novamente
                        </Button>
                    </div>
                </Card>
            </Container>
        )
    }

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1 className="display-5 fw-bold text-primary m-0">Biblioteca de Vídeos</h1>
                <Link to="/upload">
                    <Button variant="primary" className="rounded-pill px-4 py-2 d-flex align-items-center">
                        <span className="me-2">+</span>
                        <span>Adicionar Vídeo</span>
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" size="lg" />
                    <p className="mt-3 text-muted">Carregando sua biblioteca...</p>
                </div>
            ) : videos.length === 0 ? (
                <Card className="border-0 shadow text-center p-5 rounded-3 my-5">
                    <div className="fs-1 mb-3 text-secondary">📭</div>
                    <h2 className="h4 fw-bold text-secondary mb-3">Nenhum vídeo encontrado</h2>
                    <p className="text-muted mb-4">Adicione vídeos para começar a construir sua biblioteca.</p>
                    <div className="d-flex justify-content-center">
                        <Link to="/upload">
                            <Button variant="primary" className="rounded-pill px-4 py-2">Upload de Vídeo</Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {videos.map((video) => (
                        <Col key={video.id}>
                            <VideoCard
                                video={video}
                                onEdit={() => handleEditClick(video)}
                                onDelete={() => handleDeleteClick(video)}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            {/* Modal de Edição */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-primary">Editar Vídeo</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2">
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Título</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={editForm.title}
                                onChange={handleEditChange}
                                required
                                className="rounded-3 border-1"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Descrição</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={editForm.description}
                                onChange={handleEditChange}
                                rows={4}
                                className="rounded-3 border-1"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Ordem de exibição</Form.Label>
                            <Form.Control
                                type="number"
                                name="order"
                                value={editForm.order}
                                onChange={handleEditChange}
                                min="1"
                                className="rounded-3 border-1"
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="outline-secondary" onClick={() => setShowEditModal(false)} className="rounded-pill px-4">
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit" className="rounded-pill px-4">
                                Salvar alterações
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal de Confirmação de Exclusão */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-danger">Confirmar exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2">
                    <p>Tem certeza que deseja excluir o vídeo "{currentVideo?.title}"?</p>
                    <p className="text-danger fw-semibold">Esta ação não pode ser desfeita.</p>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)} className="rounded-pill px-4">
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm} className="rounded-pill px-4">
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

function VideoCard({ video, onEdit, onDelete }) {
    const [thumbnailError, setThumbnailError] = useState(false);

    const handleThumbnailError = (errorMsg) => {
        console.error('Erro na thumbnail:', errorMsg);
        setThumbnailError(true);
    };

    return (
        <Card className="h-100 border-0 shadow-sm video-card rounded-3 overflow-hidden">
            <div className="video-thumbnail position-relative">
                <Link to={`/videos/${video.id}`} className="text-decoration-none">
                    {video.thumbnailUrl && !thumbnailError ? (
                        <ThumbnailImage
                            thumbnailUrl={video.thumbnailUrl}
                            alt={`Thumbnail para ${video.title}`}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                            onError={handleThumbnailError}
                        />
                    ) : (
                        <div className="bg-light d-flex align-items-center justify-content-center p-4" style={{ aspectRatio: '16/9' }}>
                            <span className="display-4 text-secondary">🎬</span>
                        </div>
                    )}
                    <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-dark bg-opacity-75 px-2 py-1 rounded-pill">
                            {video.duration ? video.duration : '—:—'}
                        </span>
                    </div>
                </Link>
            </div>
            <Card.Body className="d-flex flex-column">
                <Link to={`/videos/${video.id}`} className="text-decoration-none">
                    <Card.Title className="fw-bold mb-2 text-truncate" style={{ fontSize: '1.1rem' }}>{video.title}</Card.Title>
                </Link>
                <Card.Text className="text-muted small mb-3 two-lines">
                    {video.description || "Sem descrição"}
                </Card.Text>
                <div className="mt-auto d-flex justify-content-between">
                    <Button
                        variant="link"
                        onClick={onEdit}
                        className="p-0 text-decoration-none text-primary"
                        aria-label="Editar vídeo"
                    >
                        <i className="bi bi-pencil-square me-1"></i> Editar
                    </Button>
                    <Button
                        variant="link"
                        onClick={onDelete}
                        className="p-0 text-decoration-none text-danger"
                        aria-label="Excluir vídeo"
                    >
                        <i className="bi bi-trash me-1"></i> Excluir
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )
}

export default VideoList 