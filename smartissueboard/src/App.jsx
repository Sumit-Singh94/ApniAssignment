import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"
import { useEffect, useState } from "react"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, u => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  if (loading) return null

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Dashboard user={user} /> : <Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
