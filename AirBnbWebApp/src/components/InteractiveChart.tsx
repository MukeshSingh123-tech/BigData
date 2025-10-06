import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  x: number;
  y: number;
  borough: string;
  price: number;
}

export const InteractiveChart = ({ title, data, className = "" }: {
  title: string;
  data: DataPoint[];
  className?: string;
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [animatedData, setAnimatedData] = useState<DataPoint[]>([]);

  useEffect(() => {
    // Animate data points in
    const timer = setTimeout(() => {
      setAnimatedData(data);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [data]);

  const maxPrice = Math.max(...data.map(d => d.price));
  const minPrice = Math.min(...data.map(d => d.price));

  const getPointColor = (borough: string) => {
    const colors = {
      "Manhattan": "hsl(var(--primary))",
      "Brooklyn": "hsl(var(--data-secondary))",
      "Queens": "hsl(var(--accent))",
      "Staten Island": "hsl(var(--data-success))",
      "Bronx": "hsl(var(--data-warning))"
    };
    return colors[borough as keyof typeof colors] || "hsl(var(--muted))";
  };

  return (
    <Card className={`bg-gradient-card border-border/50 shadow-float ${className}`}>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg
            width="100%"
            height="300"
            viewBox="0 0 400 300"
            className="overflow-visible"
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {/* Grid lines */}
            {Array.from({ length: 5 }, (_, i) => (
              <g key={i}>
                <line
                  x1="40"
                  y1={50 + i * 50}
                  x2="360"
                  y2={50 + i * 50}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  opacity="0.3"
                />
                <text
                  x="30"
                  y={55 + i * 50}
                  fill="hsl(var(--muted-foreground))"
                  fontSize="10"
                  textAnchor="end"
                >
                  ${Math.round(maxPrice - (i * (maxPrice - minPrice) / 4))}
                </text>
              </g>
            ))}
            
            {/* Data points */}
            {animatedData.map((point, index) => {
              const x = 40 + (point.x * 320);
              const y = 250 - ((point.price - minPrice) / (maxPrice - minPrice)) * 200;
              
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r={hoveredPoint === point ? 8 : 5}
                    fill={getPointColor(point.borough)}
                    className="transition-all duration-300 cursor-pointer animate-bounce-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onMouseEnter={() => setHoveredPoint(point)}
                  />
                  {hoveredPoint === point && (
                    <g>
                      <rect
                        x={x - 40}
                        y={y - 35}
                        width="80"
                        height="25"
                        rx="4"
                        fill="hsl(var(--background))"
                        stroke="hsl(var(--border))"
                        className="animate-scale-in"
                      />
                      <text
                        x={x}
                        y={y - 20}
                        fill="hsl(var(--foreground))"
                        fontSize="10"
                        textAnchor="middle"
                      >
                        ${point.price}
                      </text>
                      <text
                        x={x}
                        y={y - 10}
                        fill="hsl(var(--muted-foreground))"
                        fontSize="8"
                        textAnchor="middle"
                      >
                        {point.borough}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
            
            {/* Axes */}
            <line
              x1="40"
              y1="250"
              x2="360"
              y2="250"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
            <line
              x1="40"
              y1="50"
              x2="40"
              y2="250"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
            
            {/* Labels */}
            <text
              x="200"
              y="280"
              fill="hsl(var(--muted-foreground))"
              fontSize="12"
              textAnchor="middle"
            >
              Reviews per Month
            </text>
            <text
              x="20"
              y="150"
              fill="hsl(var(--muted-foreground))"
              fontSize="12"
              textAnchor="middle"
              transform="rotate(-90 20 150)"
            >
              Price ($)
            </text>
          </svg>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {["Manhattan", "Brooklyn", "Queens", "Staten Island", "Bronx"].map((borough) => (
              <div key={borough} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getPointColor(borough) }}
                />
                <span className="text-xs text-muted-foreground">{borough}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};