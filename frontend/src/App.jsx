import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import Authentication from './pages/AuthPage'
import VideoMeeting from './pages/videoMeeting'
import Home from './pages/Home'
import History from './pages/history'
function App() {
  return (
    <>
      <Router>

        <AuthProvider> 
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/home" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/:url" element={<VideoMeeting />} />
        </Routes>
        </AuthProvider>

      </Router>
    </>
  )
}

export default App
