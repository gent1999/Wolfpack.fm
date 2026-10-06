import { Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';
import Radio from './pages/Radio.jsx';
import Artists from './pages/Artists.jsx';
import ArtistPage from './pages/ArtistPage.jsx';
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
import ArtistsList from './admin/pages/ArtistsList.jsx';
import ArtistForm from './admin/pages/ArtistForm.jsx';
import RadioTracksList from './admin/pages/RadioTracksList.jsx';
import RadioTrackForm from './admin/pages/RadioTrackForm.jsx';

function PublicPage({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
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
        <Route path="/artists/:slug" element={<PublicPage><ArtistPage /></PublicPage>} />
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
          <Route path="artists" element={<ArtistsList />} />
          <Route path="artists/new" element={<ArtistForm />} />
          <Route path="artists/:id/edit" element={<ArtistForm />} />
          <Route path="radio-tracks" element={<RadioTracksList />} />
          <Route path="radio-tracks/new" element={<RadioTrackForm />} />
          <Route path="radio-tracks/:id/edit" element={<RadioTrackForm />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
