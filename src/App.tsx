import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';

export function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductGrid />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
