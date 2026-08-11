import { useState, useEffect } from 'react'
import api from '../api'

export default function useBackendAwake() {
    const [isAwake, setIsAwake] = useState(false)
    const [error, setError] = useState(null)

    const checkBackend = async (retries = 8, delay = 5000) => {
        for (let i = 0; i < retries; i++) {
            try {
                await api.get('/api/health/', { timeout: 10000 })
                setIsAwake(true)
                return
            } catch (err) {
                if (i < retries - 1) {
                    await new Promise(r => setTimeout(r, delay * Math.pow(2, i)))
                }
            }
        }
        setError('Server took too long to wake up. Please try again.')
    }

    useEffect(() => {
        checkBackend()
    }, [])

    return { isAwake, error, retry: () => { setError(null); checkBackend() } }
}