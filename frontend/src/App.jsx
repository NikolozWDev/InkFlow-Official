import React, { useState, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants'
import AuthProvider, { useAuth } from './AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import Navbar from './components/Navbar'
import AboutPage from './pages/AboutPage'
import LoadingOverlay from './components/LoadingOverlay'
import Toast from './components/Toast'
import useBackendAwake from './hooks/useBackendAwake'

function Logout() {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    return <Navigate to="/login" />
}

const App = () => {
    const { isAwake, error, retry } = useBackendAwake()
    const [loading, setLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState("Loading...")
    const [toast, setToast] = useState(null)

    const showToast = useCallback((message, type = 'error') => {
        setToast({ message, type })
    }, [])

    const startLoading = useCallback((msg = "Loading...") => {
        setLoadingMessage(msg)
        setLoading(true)
    }, [])

    const stopLoading = useCallback(() => {
        setLoading(false)
    }, [])

    if (!isAwake && !error) {
        return (
            <LoadingOverlay message="Waking up the server… This may take up to a minute." />
        )
    }

    if (error) {
        return (
            <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
                <p className="text-xl mb-4">{error}</p>
                <button
                    onClick={retry}
                    className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <Router>
            <AuthProvider>
                <Navbar startLoading={startLoading} stopLoading={stopLoading} showToast={showToast} />
                <div className="main-container px-[20px] bg-[url(../public/assets/picture1.jpg)] bg-no-repeat bg-center bg-cover bg-fixed min-h-screen w-screen">
                    <Routes>
                        <Route path="/" element={
                            <ProtectedRoute>
                                <HomePage startLoading={startLoading} stopLoading={stopLoading} showToast={showToast} />
                            </ProtectedRoute>
                        } />
                        <Route path="/register" element={<RegisterPage startLoading={startLoading} stopLoading={stopLoading} showToast={showToast} />} />
                        <Route path="/login" element={<LoginPage startLoading={startLoading} stopLoading={stopLoading} showToast={showToast} />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
                {loading && <LoadingOverlay message={loadingMessage} />}
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AuthProvider>
        </Router>
    )
}

export default App