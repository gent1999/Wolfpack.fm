import { Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Home from './pages/Home.jsx';
import Radio from './pages/Radio.jsx';
import Artists from './pages/Artists.jsx';
import Stories from './pages/Stories.jsx';
import Story from './pages/Story.jsx';
import Submit from './pages/Submit.jsx';
import { AuthProvider } from './admin/AuthContext.jsx';
import ProtectedRoute from './admin/ProtectedRoute.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import Login from './admin/pages/Login.jsx';
import Dashboard from './admin/pages/Dashboard.jsx';
import ArticlesList from './admin/pages/ArticlesList.jsx';
import ArticleForm from './admin/pages/ArticleForm.jsx';

function PublicPage({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicPage><Home /></PublicPage>} />
        <Route path="/radio" element={<PublicPage><Radio /></PublicPage>} />
        <Route path="/artists" element={<PublicPage><Artists /></PublicPage>} />
        <Route path="/stories" element={<PublicPage><Stories /></PublicPage>} />
        <Route path="/stories/:slug" element={<PublicPage><Story /></PublicPage>} />
        <Route path="/submit" element={<PublicPage><Submit /></PublicPage>} />

        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="articles" element={<ArticlesList />} />
          <Route path="articles/new" element={<ArticleForm />} />
          <Route path="articles/:id/edit" element={<ArticleForm />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
