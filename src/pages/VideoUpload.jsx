import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Form, Row, Col, Card, Button, ProgressBar, Alert } from 'react-bootstrap'
import { addVideo } from '../data/videos'
import { uploadVideo, uploadThumbnail } from '../services/dbService'

function VideoUpload() {
    const navigate = useNavigate()
    const uploadProcessing = useRef(false)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        order: '',
        file: null,
        thumbnailFile: null
    })

    const [preview, setPreview] = useState(null)
    const [thumbnailPreview, setThumbnailPreview] = useState(null)
    const [videoUrl, setVideoUrl] = useState(null)
    const [thumbnailUrl, setThumbnailUrl] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadComplete, setUploadComplete] = useState(false)
    const [uploadedVideo, setUploadedVideo] = useState(null)
    const [error, setError] = useState(null)

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
            // Verificar o tamanho do arquivo (limite de 50MB para IndexedDB)
            const MAX_SIZE = 50 * 1024 * 1024; // 50MB em bytes
            if (file.size > MAX_SIZE) {
                setError(`O arquivo é muito grande (${(file.size / (1024 * 1024)).toFixed(2)}MB). O tamanho máximo permitido é 50MB.`);
                return;
            }

            setFormData(prev => ({
                ...prev,
                file
            }))

            // Criar URL para preview local do arquivo de vídeo
            const url = URL.createObjectURL(file)
            setPreview(url)
            setError(null)
        }
    }

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Verificar se é uma imagem
            if (!file.type.startsWith('image/')) {
                setError('Por favor selecione uma imagem válida para a thumbnail (JPG, PNG, etc).');
                return;
            }

            // Verificar o tamanho do arquivo (limite de 2MB)
            const MAX_SIZE = 2 * 1024 * 1024; // 2MB em bytes
            if (file.size > MAX_SIZE) {
                setError(`A imagem é muito grande (${(file.size / (1024 * 1024)).toFixed(2)}MB). O tamanho máximo permitido é 2MB.`);
                return;
            }

            setFormData(prev => ({
                ...prev,
                thumbnailFile: file
            }))

            // Criar URL para preview local da thumbnail
            const url = URL.createObjectURL(file)
            setThumbnailPreview(url)
            setError(null)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Previne múltiplas chamadas
        if (uploadProcessing.current || isUploading) {
            return;
        }

        try {
            uploadProcessing.current = true;
            setIsUploading(true)
            setUploadProgress(0)
            setError(null)

            // Gerar ID único para o vídeo
            const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Gerar ID único para a thumbnail, se existir
            let thumbnailId = null;
            let thumbnailDbUrl = null;

            if (formData.thumbnailFile) {
                thumbnailId = `thumb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                // Upload da thumbnail para o IndexedDB
                thumbnailDbUrl = await uploadThumbnail(
                    formData.thumbnailFile,
                    thumbnailId
                );
            }

            // Upload do arquivo de vídeo para o IndexedDB
            const videoDbUrl = await uploadVideo(
                formData.file,
                videoId,
                (progress) => setUploadProgress(progress)
            );

            // Salvar os metadados do vídeo com a URL de referência
            const newVideo = await addVideo({
                title: formData.title,
                description: formData.description,
                order: parseInt(formData.order) || 1,
                url: videoDbUrl, // URL de referência para o IndexedDB
                fileName: formData.file.name,
                videoId: videoId, // Guardar o ID para recuperação
                thumbnailUrl: thumbnailDbUrl, // URL da thumbnail (se houver)
                thumbnailId: thumbnailId, // ID da thumbnail (se houver)
                hasThumbnail: !!thumbnailDbUrl // Flag indicando se tem thumbnail
            });

            if (newVideo) {
                setUploadedVideo(newVideo)
                setVideoUrl(videoDbUrl)
                setThumbnailUrl(thumbnailDbUrl)
                setUploadComplete(true)
            } else {
                setError("Não foi possível adicionar o vídeo - título ou arquivo já existe.")
            }
        } catch (error) {
            console.error("Erro durante o upload:", error);
            setError(`Falha no upload: ${error.message}`);
        } finally {
            setIsUploading(false)
            uploadProcessing.current = false
        }
    }

    const handleViewVideo = () => {
        if (uploadedVideo) {
            navigate(`/videos/${uploadedVideo.id}`)
        }
    }

    const handleNewUpload = () => {
        setFormData({
            title: '',
            description: '',
            order: '',
            file: null,
            thumbnailFile: null
        })
        setPreview(null)
        setThumbnailPreview(null)
        setVideoUrl(null)
        setThumbnailUrl(null)
        setUploadComplete(false)
        setUploadedVideo(null)
        setError(null)
        uploadProcessing.current = false;
    }

    return (
        <Container className="py-4">
            <h1 className="h2 mb-4">Upload de Vídeo</h1>

            {uploadComplete ? (
                <Alert variant="success" className="text-center p-4">
                    <div className="fs-1 mb-3">✅</div>
                    <h2 className="h4 fw-bold mb-3">Upload Concluído!</h2>
                    <p className="mb-4">Seu vídeo foi enviado com sucesso e está armazenado no seu navegador.</p>
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
                        {error && (
                            <Alert variant="danger" className="mb-4">
                                {error}
                            </Alert>
                        )}

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

                                    <Form.Group className="mb-4">
                                        <Form.Label>Thumbnail personalizada (opcional)</Form.Label>

                                        {thumbnailPreview ? (
                                            <div className="border rounded mb-3">
                                                <div className="thumbnail-container" style={{ height: '150px', backgroundColor: '#f8f9fa' }}>
                                                    <img
                                                        src={thumbnailPreview}
                                                        alt="Thumbnail Preview"
                                                        className="w-100 h-100"
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className="upload-area mb-3"
                                                onClick={() => document.getElementById('thumbnail-upload').click()}
                                                style={{ height: '150px', cursor: 'pointer', border: '2px dashed #dee2e6', borderRadius: '0.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                                            >
                                                <div className="fs-2 text-secondary mb-2">🖼️</div>
                                                <p className="text-muted mb-2">Clique para adicionar uma thumbnail</p>
                                                <span className="badge bg-light text-primary">JPG, PNG, GIF (máx 2MB)</span>
                                            </div>
                                        )}

                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailChange}
                                            className="d-none"
                                            id="thumbnail-upload"
                                        />

                                        <div className="d-grid">
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() => document.getElementById('thumbnail-upload').click()}
                                                type="button"
                                                size="sm"
                                            >
                                                {thumbnailPreview ? "Alterar thumbnail" : "Selecionar thumbnail"}
                                            </Button>
                                        </div>
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
                                                <span className="badge bg-light text-primary">MP4, WebM, AVI (máx 50MB)</span>
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
                                    <p className="text-center mb-2">
                                        Processando e armazenando vídeo...
                                    </p>
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