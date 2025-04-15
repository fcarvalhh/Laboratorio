import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import VideoList from './pages/VideoList'
import VideoPlayerPage from './pages/VideoPlayer'
import VideoUpload from './pages/VideoUpload'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="videos" element={<VideoList />} />
          <Route path="videos/:id" element={<VideoPlayerPage />} />
          <Route path="upload" element={<VideoUpload />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
