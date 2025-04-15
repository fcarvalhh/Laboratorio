import { Link, useLocation } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'

function Header() {
    const location = useLocation()

    const isActive = (path) => {
        return location.pathname === path ||
            (path !== '/' && location.pathname.startsWith(path))
    }

    return (
        <Navbar bg="white" expand="md" className="shadow-sm py-3 mb-4 border-bottom">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <span className="me-2 fs-4">📹</span>
                    <span className="fw-bold" style={{ fontSize: '1.3rem', color: '#3b82f6' }}>55-Jam-Video</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbar-nav" className="border-0" />

                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link
                            as={Link}
                            to="/"
                            active={isActive('/')}
                            className={`d-flex align-items-center px-3 mx-1 rounded-pill ${isActive('/') ? 'fw-semibold' : 'fw-medium'}`}
                        >
                            <i className="bi bi-house me-2"></i>
                            <span>Home</span>
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/videos"
                            active={isActive('/videos')}
                            className={`d-flex align-items-center px-3 mx-1 rounded-pill ${isActive('/videos') ? 'fw-semibold' : 'fw-medium'}`}
                        >
                            <i className="bi bi-collection-play me-2"></i>
                            <span>Vídeos</span>
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/upload"
                            active={isActive('/upload')}
                            className={`d-flex align-items-center px-3 mx-1 rounded-pill ${isActive('/upload') ? 'fw-semibold' : 'fw-medium'}`}
                        >
                            <i className="bi bi-cloud-arrow-up me-2"></i>
                            <span>Upload</span>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header 