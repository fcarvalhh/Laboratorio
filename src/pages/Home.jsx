import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'

function Home() {
    return (
        <Container className="py-5">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-primary mb-4">55-Jam-Video</h1>
                <p className="lead mb-5">
                    Uma solução profissional para gerenciamento e reprodução de vídeos.
                </p>

                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mb-5">
                    <Link to="/videos">
                        <Button variant="primary" size="lg" className="px-4">
                            Ver Biblioteca
                        </Button>
                    </Link>
                    <Link to="/upload">
                        <Button variant="outline-primary" size="lg" className="px-4">
                            Fazer Upload
                        </Button>
                    </Link>
                </div>
            </div>

            <Row className="g-4">
                <Col md={4}>
                    <Card className="h-100 shadow-sm text-center p-4">
                        <div className="fs-1 text-primary mb-3">📋</div>
                        <Card.Body>
                            <Card.Title className="fw-bold mb-3">Organize seus vídeos</Card.Title>
                            <Card.Text className="text-muted">
                                Adicione títulos, descrições e ordene seus vídeos facilmente.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="h-100 shadow-sm text-center p-4">
                        <div className="fs-1 text-primary mb-3">📺</div>
                        <Card.Body>
                            <Card.Title className="fw-bold mb-3">Player profissional</Card.Title>
                            <Card.Text className="text-muted">
                                Assista seus vídeos com controles intuitivos e responsivos.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="h-100 shadow-sm text-center p-4">
                        <div className="fs-1 text-primary mb-3">🔍</div>
                        <Card.Body>
                            <Card.Title className="fw-bold mb-3">Navegação simples</Card.Title>
                            <Card.Text className="text-muted">
                                Encontre rapidamente o que procura com nossa interface amigável.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Home 