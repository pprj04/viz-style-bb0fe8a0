import React from 'react';
import { Zap, Shield, Palette, Camera } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get your virtual try-on results in seconds with our advanced AI.',
  },
  {
    icon: Shield,
    title: 'Identity Preserved',
    description: 'Your face and body proportions remain perfectly intact.',
  },
  {
    icon: Palette,
    title: 'Realistic Textures',
    description: 'Fabric details, shadows, and lighting look natural.',
  },
  {
    icon: Camera,
    title: 'Studio Quality',
    description: '8K resolution output ready for any use case.',
  },
];

const Features: React.FC = () => {
  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Why Choose <span className="gradient-text">TryOnAI</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            State-of-the-art AI technology for the most realistic virtual try-on experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-lg font-medium text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
