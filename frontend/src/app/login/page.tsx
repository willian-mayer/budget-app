'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isRegistering) {
      // Guardamos "usuario" en localStorage
      localStorage.setItem('user', JSON.stringify({ email, password }))
      localStorage.setItem('isAuthenticated', 'true')
      router.push('/')
    } else {
      const storedUser = localStorage.getItem('user')
      if (!storedUser) {
        alert('No hay usuarios registrados. Regístrate primero.')
        return
      }

      const { email: savedEmail, password: savedPassword } = JSON.parse(storedUser)

      if (email === savedEmail && password === savedPassword) {
        localStorage.setItem('isAuthenticated', 'true')
        router.push('/')
      } else {
        alert('Correo o contraseña incorrectos.')
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-6">
        {isRegistering ? 'Registro' : 'Iniciar sesión'}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-1/3">
        <input
          className="border p-2"
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          type="submit"
        >
          {isRegistering ? 'Registrarse' : 'Iniciar sesión'}
        </button>
      </form>

      <button
        className="mt-4 text-blue-600 underline"
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering
          ? '¿Ya tienes cuenta? Inicia sesión'
          : '¿No tienes cuenta? Regístrate'}
      </button>
    </div>
  )
}
