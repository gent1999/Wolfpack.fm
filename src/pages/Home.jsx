import Hero from '../components/home/Hero.jsx';
import ArticlesSection from '../components/home/ArticlesSection.jsx';

function Home() {
  return (
    <main className="page-main" aria-label="Home">
      <Hero />
      <ArticlesSection />
    </main>
  );
}

export default Home;
