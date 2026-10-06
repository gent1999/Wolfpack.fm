import Hero from '../components/home/Hero.jsx';
import ArticlesSection from '../components/home/ArticlesSection.jsx';
import ArtistsSection from '../components/home/ArtistsSection.jsx';
import './Home.css';

function Home() {
  return (
    <main className="page-main" aria-label="Home">
      <Hero />
      <div className="home-backdrop">
        <ArticlesSection />
        <ArtistsSection />
      </div>
    </main>
  );
}

export default Home;
