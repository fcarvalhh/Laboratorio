import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white border-top py-5 mt-5">
            <Container>
                <Row className="mb-4">
                    <Col md={4} className="mb-4 mb-md-0">
                        <h3 className="h5 fw-bold mb-3" style={{ color: '#3b82f6' }}>55-Jam-Video</h3>
                        <p className="text-muted">
                            Uma plataforma moderna para gerenciamento e reprodução de vídeos.
                        </p>
                        <div className="d-flex mt-4">
                            <a href="#" className="me-3 text-secondary fs-5" aria-label="Facebook">
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="#" className="me-3 text-secondary fs-5" aria-label="Twitter">
                                <i className="bi bi-twitter-x"></i>
                            </a>
                            <a href="#" className="me-3 text-secondary fs-5" aria-label="Instagram">
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="#" className="text-secondary fs-5" aria-label="LinkedIn">
                                <i className="bi bi-linkedin"></i>
                            </a>
                        </div>
                    </Col>

                    <Col md={4} className="mb-4 mb-md-0">
                        <h4 className="h6 fw-bold mb-3 text-secondary">Links Rápidos</h4>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/" className="text-decoration-none text-muted">
                                    <i className="bi bi-chevron-right me-1 small"></i> Home
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/videos" className="text-decoration-none text-muted">
                                    <i className="bi bi-chevron-right me-1 small"></i> Biblioteca de Vídeos
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/upload" className="text-decoration-none text-muted">
                                    <i className="bi bi-chevron-right me-1 small"></i> Upload de Vídeo
                                </Link>
                            </li>
                        </ul>
                    </Col>

                    <Col md={4}>
                        <h4 className="h6 fw-bold mb-3 text-secondary">Contato</h4>
                        <ul className="list-unstyled">
                            <li className="mb-2 d-flex align-items-center">
                                <i className="bi bi-envelope me-2 text-primary"></i>
                                <span className="text-muted">contato@55jamvideo.com</span>
                            </li>
                            <li className="mb-2 d-flex align-items-center">
                                <i className="bi bi-telephone me-2 text-primary"></i>
                                <span className="text-muted">(00) 12345-6789</span>
                            </li>
                            <li className="mb-2 d-flex align-items-center">
                                <i className="bi bi-geo-alt me-2 text-primary"></i>
                                <span className="text-muted">São Paulo, SP</span>
                            </li>
                        </ul>
                    </Col>
                </Row>

                <div className="border-top pt-4 text-center small">
                    <p className="mb-0 text-muted">&copy; {currentYear} 55jamvideo. Todos os direitos reservados.</p>
                </div>
            </Container>
        </footer>
    )
}

export default Footer 