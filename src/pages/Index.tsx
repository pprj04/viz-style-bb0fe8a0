import React from 'react';
import Header from '@/components/Header';
import TryOnSection from '@/components/TryOnSection';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <TryOnSection />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
