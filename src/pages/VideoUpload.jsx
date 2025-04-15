import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Form, Row, Col, Card, Button, ProgressBar, Alert } from 'react-bootstrap'
import { addVideo } from '../data/videos'

function VideoUpload() {
    const navigate = useNavigate()
    const uploadProcessing = useRef(false)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        order: '',
        file: null
    })

    const [preview, setPreview] = useState(null)
    const [videoUrl, setVideoUrl] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadComplete, setUploadComplete] = useState(false)
    const [uploadedVideo, setUploadedVideo] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({
                ...prev,
                file
            }))

            // Criar URL para o arquivo de vídeo
            const url = URL.createObjectURL(file)
            setPreview(url)
            setVideoUrl(url)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Previne múltiplas chamadas
        if (uploadProcessing.current || isUploading) {
            return;
        }

        uploadProcessing.current = true;
        setIsUploading(true)
        setUploadProgress(0)

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsUploading(false)

                    // Adicionar o vídeo aos dados mockados
                    const newVideo = addVideo({
                        title: formData.title,
                        description: formData.description,
                        order: parseInt(formData.order) || 1,
                        url: videoUrl,
                        fileName: formData.file.name
                    })

                    // Verificar se o vídeo foi adicionado com sucesso (não é duplicado)
                    if (newVideo) {
                        setUploadedVideo(newVideo)
                        setUploadComplete(true)
                    } else {
                        // Lida com o caso de duplicata: informa o usuário
                        // Poderia mostrar uma mensagem de erro mais específica aqui
                        console.error("Falha no upload: Vídeo duplicado detectado.");
                        // Resetar estado para permitir novo upload ou mostrar erro
                        // O estado uploadProcessing.current precisa ser resetado aqui também
                        // para permitir que o usuário tente novamente ou submeta outro vídeo
                        // Poderia também setar um estado de erro para mostrar na UI
                    }
                    uploadProcessing.current = false; // Resetar independentemente do sucesso
                    return 100
                }
                return prev + 10
            })
        }, 300)
    }

    const handleViewVideo = () => {
        if (uploadedVideo) {
            navigate(`/videos/${uploadedVideo.id}`)
        }
    }

    const handleNewUpload = () => {
        setFormData({ title: '', description: '', order: '', file: null })
        setPreview(null)
        setVideoUrl(null)
        setUploadComplete(false)
        setUploadedVideo(null)
        uploadProcessing.current = false;
    }

    return (
        <Container className="py-4">
            <h1 className="h2 mb-4">Upload de Vídeo</h1>

            {uploadComplete ? (
                <Alert variant="success" className="text-center p-4">
                    <div className="fs-1 mb-3">✅</div>
                    <h2 className="h4 fw-bold mb-3">Upload Concluído!</h2>
                    <p className="mb-4">Seu vídeo foi enviado com sucesso.</p>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                        <Button
                            variant="primary"
                            onClick={handleViewVideo}
                        >
                            Ver Vídeo
                        </Button>
                        <Link to="/videos">
                            <Button variant="outline-primary">Ver Biblioteca</Button>
                        </Link>
                        <Button
                            variant="outline-secondary"
                            onClick={handleNewUpload}
                        >
                            Fazer Outro Upload
                        </Button>
                    </div>
                </Alert>
            ) : (
                <Card className="shadow-sm">
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Título do vídeo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Descrição</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Ordem de exibição</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="order"
                                            value={formData.order}
                                            onChange={handleChange}
                                            min="1"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Arquivo de vídeo</Form.Label>

                                        {preview ? (
                                            <div className="border rounded mb-3">
                                                <div className="player-container" style={{ height: '200px' }}>
                                                    <video
                                                        src={preview}
                                                        className="w-100 h-100"
                                                        style={{ objectFit: 'contain' }}
                                                        controls
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className="upload-area mb-3"
                                                onClick={() => document.getElementById('video-upload').click()}
                                            >
                                                <div className="fs-2 text-secondary mb-2">📁</div>
                                                <p className="text-muted mb-3">Clique para selecionar um arquivo de vídeo</p>
                                                <span className="badge bg-light text-primary">MP4, WebM, AVI</span>
                                            </div>
                                        )}

                                        <Form.Control
                                            type="file"
                                            accept="video/*"
                                            onChange={handleFileChange}
                                            className="d-none"
                                            id="video-upload"
                                            required={!preview}
                                        />

                                        <div className="d-grid">
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() => document.getElementById('video-upload').click()}
                                                type="button"
                                            >
                                                {preview ? "Alterar arquivo" : "Selecionar arquivo"}
                                            </Button>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {isUploading && (
                                <div className="my-3">
                                    <ProgressBar
                                        animated
                                        now={uploadProgress}
                                        label={`${uploadProgress}%`}
                                    />
                                </div>
                            )}

                            <div className="d-flex justify-content-end mt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isUploading || !formData.file || uploadProcessing.current}
                                >
                                    {isUploading ? 'Enviando...' : 'Enviar vídeo'}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            )}
        </Container>
    )
}

export default VideoUpload 