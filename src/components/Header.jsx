import { Link, useLocation } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'

function Header() {
    const location = useLocation()

    const isActive = (path) => {
        return location.pathname === path ||
            (path !== '/' && location.pathname.startsWith(path))
    }

    return (
        <Navbar bg="primary" variant="dark" expand="md" className="shadow-sm mb-3">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <span className="me-2">📹</span>
                    <span>55-Jam-Video</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbar-nav" />

                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link
                            as={Link}
                            to="/"
                            active={isActive('/')}
                            className="d-flex align-items-center"
                        >
                            <span className="me-1">🏠</span>
                            <span>Home</span>
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/videos"
                            active={isActive('/videos')}
                            className="d-flex align-items-center"
                        >
                            <span className="me-1">📼</span>
                            <span>Vídeos</span>
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/upload"
                            active={isActive('/upload')}
                            className="d-flex align-items-center"
                        >
                            <span className="me-1">📤</span>
                            <span>Upload</span>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header 