import { useEffect, useState } from "react";

export const ParallaxBackground = ({ children, className = "" }: { 
  children: React.ReactNode; 
  className?: string; 
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Animated background elements */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-primary rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-secondary rounded-full blur-lg animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-neural rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />
        
        {/* Data visualization elements */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-10">
          {Array.from({ length: 20 }, (_, i) => (
            <circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 3 + 1}
              fill="hsl(var(--primary))"
              className="animate-neural-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
          
          {/* Connecting lines */}
          {Array.from({ length: 10 }, (_, i) => (
            <line
              key={i}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              opacity="0.3"
              className="animate-fade-in"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </svg>
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};