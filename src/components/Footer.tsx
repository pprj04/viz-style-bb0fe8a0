import React from 'react';
import { Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 px-4 md:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-medium text-foreground">
            TryOn<span className="gradient-text">AI</span>
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          © 2024 TryOnAI. Powered by advanced AI technology.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
