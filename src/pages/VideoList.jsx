import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Spinner, Button, Modal, Form } from 'react-bootstrap'
import { getVideos, updateVideo, deleteVideo } from '../data/videos'

function VideoList() {
    const [videos, setVideos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
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
        try {
            // Delay simulado de 500ms
            await new Promise(resolve => setTimeout(resolve, 300))
            const data = getVideos()
            setVideos(data)
        } catch (error) {
            console.error('Erro ao carregar vídeos:', error)
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

    const handleEditSubmit = (e) => {
        e.preventDefault()
        if (currentVideo) {
            updateVideo(currentVideo.id, {
                title: editForm.title,
                description: editForm.description,
                order: editForm.order !== '' ? parseInt(editForm.order) : currentVideo.order
            })
            setShowEditModal(false)
            fetchVideos()
        }
    }

    const handleDeleteConfirm = () => {
        if (currentVideo) {
            deleteVideo(currentVideo.id)
            setShowDeleteModal(false)
            fetchVideos()
        }
    }

    return (
        <Container className="py-4">
            <h1 className="h2 mb-4">Biblioteca de Vídeos</h1>

            {isLoading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : videos.length === 0 ? (
                <Card className="text-center p-5">
                    <div className="fs-1 mb-3">📭</div>
                    <h2 className="h4 fw-bold text-secondary mb-3">Nenhum vídeo encontrado</h2>
                    <p className="text-muted mb-4">Adicione vídeos para começar a construir sua biblioteca.</p>
                    <div className="d-flex justify-content-center">
                        <Link to="/upload">
                            <Button variant="primary">Upload de Vídeo</Button>
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
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Vídeo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Título</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={editForm.title}
                                onChange={handleEditChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={editForm.description}
                                onChange={handleEditChange}
                                rows={4}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ordem de exibição</Form.Label>
                            <Form.Control
                                type="number"
                                name="order"
                                value={editForm.order}
                                onChange={handleEditChange}
                                min="1"
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                Salvar alterações
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal de Confirmação de Exclusão */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Tem certeza que deseja excluir o vídeo "{currentVideo?.title}"?</p>
                    <p className="text-danger">Esta ação não pode ser desfeita.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

function VideoCard({ video, onEdit, onDelete }) {
    return (
        <Card className="h-100 shadow-sm video-card">
            <div className="video-thumbnail">
                {video.url ? (
                    <video
                        src={video.url}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <span className="fs-3">🎬</span>
                )}
            </div>

            <Card.Body>
                <Card.Title className="fs-5 fw-bold">{video.title}</Card.Title>
                <Card.Text className="small text-muted mb-3 two-lines">
                    {video.description}
                </Card.Text>

                <div className="d-flex justify-content-between align-items-center">
                    {video.fileName && (
                        <small className="text-muted text-truncate me-2" style={{ maxWidth: "120px" }} title={video.fileName}>
                            {video.fileName}
                        </small>
                    )}
                    <div className="d-flex gap-2 ms-auto">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={onEdit}
                            title="Editar vídeo"
                        >
                            ✏️
                        </Button>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={onDelete}
                            title="Excluir vídeo"
                        >
                            🗑️
                        </Button>
                        <Link
                            to={`/videos/${video.id}`}
                            className="btn btn-sm btn-outline-primary"
                        >
                            ▶️
                        </Link>
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}

export default VideoList 