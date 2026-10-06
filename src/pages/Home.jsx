import Hero from '../components/home/Hero.jsx';
import ArticlesSection from '../components/home/ArticlesSection.jsx';
import ArtistsSection from '../components/home/ArtistsSection.jsx';

function Home() {
  return (
    <main className="page-main" aria-label="Home">
      <Hero />
      <ArticlesSection />
      <ArtistsSection />
    </main>
  );
}

export default Home;
