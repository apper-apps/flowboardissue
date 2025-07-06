import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import PostsList from '@/components/pages/PostsList'
import PostEditor from '@/components/pages/PostEditor'
import PostView from '@/components/pages/PostView'
import Calendar from '@/components/pages/Calendar'
import MediaLibrary from '@/components/pages/MediaLibrary'
import Settings from '@/components/pages/Settings'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="posts" element={<PostsList />} />
          <Route path="posts/new" element={<PostEditor />} />
          <Route path="posts/:id" element={<PostView />} />
          <Route path="posts/:id/edit" element={<PostEditor />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </>
  )
}

export default App