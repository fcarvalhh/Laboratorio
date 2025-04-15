import { Outlet } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './Header'
import Footer from './Footer'

function Layout() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1 py-3">
                <Container>
                    <Outlet />
                </Container>
            </main>
            <Footer />
        </div>
    )
}

export default Layout 