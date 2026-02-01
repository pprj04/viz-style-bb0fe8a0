import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shirt } from 'lucide-react';
import { Button } from './ui/button';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            TryOn<span className="gradient-text">AI</span>
          </span>
        </Link>
        
        <nav className="flex items-center gap-4 md:gap-8">
          <Link to="/virtual-wardrobe">
            <Button variant="gold" size="default" className="gap-2">
              <Shirt className="w-4 h-4" />
              <span className="hidden sm:inline">Virtual Wardrobe</span>
              <span className="sm:hidden">AR</span>
            </Button>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Gallery
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
