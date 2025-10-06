import { useEffect, useState } from "react";

interface Node {
  id: string;
  x: number;
  y: number;
  layer: number;
  active: boolean;
}

interface Connection {
  from: string;
  to: string;
  strength: number;
  active: boolean;
}

export const NeuralNetwork = ({ className = "" }: { className?: string }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    // Create network structure
    const networkNodes: Node[] = [];
    const networkConnections: Connection[] = [];
    
    // Input layer (13 features)
    for (let i = 0; i < 13; i++) {
      networkNodes.push({
        id: `input-${i}`,
        x: 50,
        y: 50 + (i * 20),
        layer: 0,
        active: Math.random() > 0.3
      });
    }
    
    // Hidden layers
    for (let layer = 1; layer <= 2; layer++) {
      const nodeCount = layer === 1 ? 8 : 5;
      for (let i = 0; i < nodeCount; i++) {
        networkNodes.push({
          id: `hidden-${layer}-${i}`,
          x: 50 + (layer * 150),
          y: 100 + (i * 30),
          layer,
          active: Math.random() > 0.4
        });
      }
    }
    
    // Output layer
    networkNodes.push({
      id: 'output-0',
      x: 350,
      y: 180,
      layer: 3,
      active: true
    });
    
    // Create connections
    networkNodes.forEach(node => {
      const nextLayerNodes = networkNodes.filter(n => n.layer === node.layer + 1);
      nextLayerNodes.forEach(nextNode => {
        networkConnections.push({
          from: node.id,
          to: nextNode.id,
          strength: Math.random(),
          active: node.active && nextNode.active
        });
      });
    });
    
    setNodes(networkNodes);
    setConnections(networkConnections);
    
    // Animate network activity
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        active: Math.random() > 0.3
      })));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        width="400"
        height="320"
        viewBox="0 0 400 320"
        className="w-full h-full"
      >
        {/* Connections */}
        {connections.map((conn, index) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          
          if (!fromNode || !toNode) return null;
          
          return (
            <line
              key={index}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={conn.active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
              strokeWidth={conn.strength * 2}
              opacity={conn.active ? 0.8 : 0.2}
              className="transition-all duration-500"
            />
          );
        })}
        
        {/* Nodes */}
        {nodes.map((node) => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={node.layer === 3 ? 8 : 4}
            fill={node.active ? "hsl(var(--primary))" : "hsl(var(--muted))"}
            className={`transition-all duration-500 ${
              node.active ? "animate-neural-pulse" : ""
            }`}
          />
        ))}
        
        {/* Layer labels */}
        <text x="50" y="30" fill="hsl(var(--muted-foreground))" fontSize="12" textAnchor="middle">
          Input Features
        </text>
        <text x="200" y="30" fill="hsl(var(--muted-foreground))" fontSize="12" textAnchor="middle">
          Hidden Layers
        </text>
        <text x="350" y="30" fill="hsl(var(--muted-foreground))" fontSize="12" textAnchor="middle">
          Price Output
        </text>
      </svg>
    </div>
  );
};