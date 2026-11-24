import { lazy, Suspense, useEffect, useState } from 'react'
import { startMenuSync } from '@/store/menu'
import { MenuPage } from '@/pages/MenuPage'

const AdminDashboard = lazy(() => import('@/components/admin/AdminDashboard'))

const isAdminRoute = () => window.location.hash.startsWith('#/admin')

export default function App() {
  const [admin, setAdmin] = useState(isAdminRoute)
  useEffect(() => {
    startMenuSync()
    const onHash = () => setAdmin(isAdminRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (admin)
    return (
      <Suspense fallback={<div className="grid min-h-dvh place-items-center text-bege/60">Carregando painel…</div>}>
        <AdminDashboard />
      </Suspense>
    )
  return <MenuPage />
}
