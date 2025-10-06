import { useEffect, useState } from "react";

export const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  prefix = "", 
  suffix = "",
  className = "" 
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(end * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return (
    <span className={`font-bold tabular-nums ${className}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};