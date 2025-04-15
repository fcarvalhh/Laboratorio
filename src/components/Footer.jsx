import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-dark text-light py-4 mt-5">
            <Container>
                <Row className="mb-4">
                    <Col md={4} className="mb-4 mb-md-0">
                        <h3 className="h5 fw-bold mb-3">55-Jam-Video</h3>
                        <p className="small">
                            Uma plataforma moderna para gerenciamento e reprodução de vídeos.
                        </p>
                    </Col>

                    <Col md={4} className="mb-4 mb-md-0">
                        <h4 className="h6 fw-bold mb-3">Links Rápidos</h4>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/" className="text-decoration-none text-light">Home</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/videos" className="text-decoration-none text-light">Biblioteca de Vídeos</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/upload" className="text-decoration-none text-light">Upload de Vídeo</Link>
                            </li>
                        </ul>
                    </Col>

                    <Col md={4}>
                        <h4 className="h6 fw-bold mb-3">Contato</h4>
                        <ul className="list-unstyled">
                            <li className="mb-2 d-flex align-items-center">
                                <span className="me-2">📧</span>
                                <span>contato@55jamvideo.com</span>
                            </li>
                            <li className="mb-2 d-flex align-items-center">
                                <span className="me-2">📱</span>
                                <span>(00) 12345-6789</span>
                            </li>
                        </ul>
                    </Col>
                </Row>

                <div className="border-top border-secondary pt-3 text-center small">
                    <p className="mb-0">&copy; {currentYear} 55jamvideo. Todos os direitos reservados.</p>
                </div>
            </Container>
        </footer>
    )
}

export default Footer 