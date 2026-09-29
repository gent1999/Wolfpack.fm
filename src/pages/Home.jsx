import Hero from '../components/home/Hero.jsx';

function Home() {
  // Hero only for this pass -- everything below it stays empty dark space
  // until the next section is built.
  return (
    <main className="page-main" aria-label="Home">
      <Hero />
    </main>
  );
}

export default Home;
