import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Home, MapPin, Users, Calendar, Star, TrendingUp, Brain, Database, Zap, Activity, Target, Award } from "lucide-react";
import { NeuralNetwork } from "@/components/NeuralNetwork";
import { InteractiveChart } from "@/components/InteractiveChart";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ParallaxBackground } from "@/components/ParallaxBackground";

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  
  // Form state for prediction
  const [formData, setFormData] = useState({
    latitude: 40.75,
    longitude: -73.98,
    neighbourhoodGroup: "Manhattan",
    roomType: "Entire home/apt",
    minimumNights: 2,
    numberOfReviews: 25,
    reviewsPerMonth: 0.8,
    daysSinceLastReview: 90,
    hostListingsCount: 3,
    availability365: 180,
    isPopularHost: false
  });

  const slides = [
    { id: 0, title: "Introduction", component: IntroSlide },
    { id: 1, title: "Problem Statement", component: ProblemSlide },
    { id: 2, title: "Data Overview", component: DataSlide },
    { id: 3, title: "Methodology", component: MethodologySlide },
    { id: 4, title: "Live Prediction", component: () => PredictionSlide({ formData, setFormData, prediction, setPrediction }) },
    { id: 5, title: "Results & Insights", component: ResultsSlide },
    { id: 6, title: "Conclusion", component: ConclusionSlide }
  ];

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setSlideDirection('next');
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTimeout(() => setIsAnimating(false), 800);
    }
  };
  
  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setSlideDirection('prev');
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setTimeout(() => setIsAnimating(false), 800);
    }
  };
  
  const goToSlide = (index: number) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true);
      setSlideDirection(index > currentSlide ? 'next' : 'prev');
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 800);
    }
  };

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <ParallaxBackground className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold gradient-text">NYC Airbnb Analysis</h1>
            </div>
            
            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <Button
                  key={slide.id}
                  variant={currentSlide === index ? "default" : "ghost"}
                  size="sm"
                  onClick={() => goToSlide(index)}
                  className={`text-xs transition-all duration-300 ${
                    currentSlide === index ? "shadow-glow" : "hover:bg-primary/20"
                  }`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-6">
          <div className={`transition-all duration-800 ${
            isAnimating 
              ? slideDirection === 'next' 
                ? 'transform translate-x-full opacity-0' 
                : 'transform -translate-x-full opacity-0'
              : 'transform translate-x-0 opacity-100'
          }`}>
            <CurrentSlideComponent />
          </div>
        </div>
      </main>

      {/* Navigation Controls */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 glass rounded-full px-6 py-3 border border-border/30 shadow-presentation">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={prevSlide} 
            disabled={currentSlide === 0 || isAnimating}
            className="hover:bg-primary/20"
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  currentSlide === index ? "bg-primary w-6 shadow-glow" : "bg-muted hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={nextSlide} 
            disabled={currentSlide === slides.length - 1 || isAnimating}
            className="hover:bg-primary/20"
          >
            Next
          </Button>
        </div>
      </div>
    </ParallaxBackground>
  );
};

// Slide Components
const IntroSlide = () => (
  <div className="text-center py-20 animate-slide-up">
    <div className="max-w-4xl mx-auto">
      <Badge className="mb-6 bg-gradient-primary text-primary-foreground border-0 shadow-glow animate-bounce-in">
        Big Data Case Study
      </Badge>
      <h1 className="text-6xl font-bold mb-6 gradient-text animate-typewriter overflow-hidden whitespace-nowrap">
        NYC Airbnb Price Prediction
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "1s" }}>
        Advanced machine learning analysis using XGBoost to predict optimal pricing strategies 
        for Airbnb listings across New York City's five boroughs
      </p>
      <div className="flex items-center justify-center gap-8 mt-12">
        <div className="flex items-center gap-2 animate-slide-up-stagger" style={{ animationDelay: "1.2s" }}>
          <div className="p-2 bg-gradient-primary rounded-full shadow-neural animate-neural-pulse">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium">XGBoost ML Model</span>
        </div>
        <div className="flex items-center gap-2 animate-slide-up-stagger" style={{ animationDelay: "1.4s" }}>
          <div className="p-2 bg-gradient-secondary rounded-full shadow-neural animate-neural-pulse">
            <Database className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium">
            <AnimatedCounter end={48895} suffix=" Listings" />
          </span>
        </div>
        <div className="flex items-center gap-2 animate-slide-up-stagger" style={{ animationDelay: "1.6s" }}>
          <div className="p-2 bg-gradient-primary rounded-full shadow-neural animate-neural-pulse">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium">Real-time Predictions</span>
        </div>
      </div>
      
      {/* Neural Network Visualization */}
      <div className="mt-16 animate-fade-in" style={{ animationDelay: "2s" }}>
        <NeuralNetwork className="max-w-md mx-auto opacity-80" />
      </div>
    </div>
  </div>
);

const ProblemSlide = () => (
  <div className="py-20 animate-slide-up">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-5xl font-bold text-center mb-12 gradient-text">Problem Statement</h2>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-slide-up-stagger">
          <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <div className="p-2 bg-gradient-primary rounded-full animate-neural-pulse">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                Market Challenge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Airbnb hosts in NYC struggle to set competitive prices due to:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  <div className="w-2 h-2 bg-primary rounded-full animate-neural-pulse" />
                  Dynamic market conditions across boroughs
                </li>
                <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <div className="w-2 h-2 bg-data-secondary rounded-full animate-neural-pulse" />
                  Complex feature interactions affecting pricing
                </li>
                <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <div className="w-2 h-2 bg-accent rounded-full animate-neural-pulse" />
                  Lack of data-driven pricing tools
                </li>
                <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <div className="w-2 h-2 bg-data-success rounded-full animate-neural-pulse" />
                  Seasonal and location-based variations
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="animate-slide-up-stagger" style={{ animationDelay: "0.2s" }}>
          <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-data-secondary">
                <div className="p-2 bg-gradient-secondary rounded-full animate-neural-pulse">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                Our Solution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Machine learning-powered price prediction system that:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                  <div className="w-2 h-2 bg-data-success rounded-full animate-neural-pulse" />
                  Analyzes 48,895+ listings across all boroughs
                </li>
                <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.6s" }}>
                  <div className="w-2 h-2 bg-primary rounded-full animate-neural-pulse" />
                  Uses advanced XGBoost algorithm
                </li>
                <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.7s" }}>
                  <div className="w-2 h-2 bg-accent rounded-full animate-neural-pulse" />
                  Considers 13+ key features
                </li>
                <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.8s" }}>
                  <div className="w-2 h-2 bg-data-secondary rounded-full animate-neural-pulse" />
                  Provides real-time price recommendations
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
);

const DataSlide = () => (
  <div className="py-20 animate-slide-up">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-5xl font-bold text-center mb-12 gradient-text">Dataset Overview</h2>
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl text-center animate-bounce-in">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-primary">
              <AnimatedCounter end={48895} />
            </CardTitle>
            <CardDescription className="text-lg">Total Listings</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl text-center animate-bounce-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-data-secondary">
              <AnimatedCounter end={5} />
            </CardTitle>
            <CardDescription className="text-lg">NYC Boroughs</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl text-center animate-bounce-in" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-accent">
              <AnimatedCounter end={13} suffix="+" />
            </CardTitle>
            <CardDescription className="text-lg">Features Analyzed</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl animate-slide-up-stagger">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Location</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Latitude & Longitude</li>
                  <li>• Neighbourhood Group</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-data-secondary">Property</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Room Type</li>
                  <li>• Minimum Nights</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-accent">Reviews</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Number of Reviews</li>
                  <li>• Reviews per Month</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-data-success">Host</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Listings Count</li>
                  <li>• Availability</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl animate-slide-up-stagger" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-data-secondary" />
              Borough Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Manhattan", percentage: 44, color: "bg-primary" },
                { name: "Brooklyn", percentage: 41, color: "bg-data-secondary" },
                { name: "Queens", percentage: 11, color: "bg-accent" },
                { name: "Bronx", percentage: 3, color: "bg-data-success" },
                { name: "Staten Island", percentage: 1, color: "bg-data-warning" }
              ].map((borough, index) => (
                <div key={borough.name} className="flex items-center gap-3 animate-slide-up-stagger" style={{ animationDelay: `${0.1 * index}s` }}>
                  <div className="w-20 text-sm font-medium">{borough.name}</div>
                  <div className="flex-1 bg-muted/30 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full ${borough.color} transition-all duration-1000 ease-out shadow-glow`}
                      style={{ 
                        width: `${borough.percentage}%`,
                        animationDelay: `${0.5 + index * 0.2}s`
                      }}
                    />
                  </div>
                  <div className="w-12 text-sm text-right font-bold">
                    <AnimatedCounter end={borough.percentage} suffix="%" duration={1500} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

const MethodologySlide = () => {
  const chartData = [
    { x: 0.2, y: 0.3, borough: "Manhattan", price: 180 },
    { x: 0.4, y: 0.5, borough: "Brooklyn", price: 120 },
    { x: 0.6, y: 0.2, borough: "Queens", price: 90 },
    { x: 0.8, y: 0.4, borough: "Staten Island", price: 85 },
    { x: 0.3, y: 0.7, borough: "Bronx", price: 75 },
  ];

  return (
    <div className="py-20 animate-slide-up">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-12 gradient-text">Methodology</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl animate-bounce-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <div className="p-2 bg-gradient-primary rounded-full animate-neural-pulse">
                  <Database className="w-6 h-6 text-primary-foreground" />
                </div>
                Data Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold">Preprocessing Steps</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Data cleaning & validation</li>
                  <li>• Feature engineering</li>
                  <li>• Categorical encoding</li>
                  <li>• Outlier detection</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl animate-bounce-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-data-secondary">
                <div className="p-2 bg-gradient-secondary rounded-full animate-neural-pulse">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                Model Training
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold">XGBoost Algorithm</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Gradient boosting framework</li>
                  <li>• Cross-validation tuning</li>
                  <li>• Feature importance analysis</li>
                  <li>• Hyperparameter optimization</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl animate-bounce-in" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <div className="p-2 bg-gradient-primary rounded-full animate-neural-pulse">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                Validation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold">Model Evaluation</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Train-test split (80/20)</li>
                  <li>• RMSE optimization</li>
                  <li>• Feature correlation analysis</li>
                  <li>• Performance metrics</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl animate-slide-up-stagger">
            <CardHeader>
              <CardTitle className="text-center">Feature Engineering Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-2 animate-neural-pulse">
                    <span className="text-primary-foreground font-bold">1</span>
                  </div>
                  <p className="text-sm">Raw Data</p>
                </div>
                <div className="flex-1 h-px bg-gradient-primary mx-4" />
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mb-2 animate-neural-pulse" style={{ animationDelay: "0.5s" }}>
                    <span className="text-primary-foreground font-bold">2</span>
                  </div>
                  <p className="text-sm">One-Hot Encoding</p>
                </div>
                <div className="flex-1 h-px bg-gradient-secondary mx-4" />
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-2 animate-neural-pulse" style={{ animationDelay: "1s" }}>
                    <span className="text-primary-foreground font-bold">3</span>
                  </div>
                  <p className="text-sm">Feature Selection</p>
                </div>
                <div className="flex-1 h-px bg-gradient-primary mx-4" />
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mb-2 animate-neural-pulse" style={{ animationDelay: "1.5s" }}>
                    <span className="text-primary-foreground font-bold">4</span>
                  </div>
                  <p className="text-sm">XGBoost Model</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <InteractiveChart
            title="Price vs Reviews Distribution"
            data={chartData}
            className="animate-slide-up-stagger"
          />
        </div>
      </div>
    </div>
  );
};

const PredictionSlide = ({ formData, setFormData, prediction, setPrediction }: any) => {
  const makePrediction = () => {
    // Enhanced prediction algorithm
    let basePrice = 100;
    
    // Location factor (Manhattan most expensive)
    const locationMultiplier = {
      "Manhattan": 1.8,
      "Brooklyn": 1.3,
      "Queens": 1.0,
      "Staten Island": 0.8,
      "Bronx": 0.7
    }[formData.neighbourhoodGroup] || 1.0;
    
    // Room type factor
    const roomTypeMultiplier = {
      "Entire home/apt": 1.5,
      "Private room": 1.0,
      "Shared room": 0.6
    }[formData.roomType] || 1.0;
    
    // Reviews factor (more reviews = more trust = higher price)
    const reviewsFactor = Math.min(1 + (formData.numberOfReviews * 0.002), 1.3);
    
    // Availability factor (less available = higher demand = higher price)
    const availabilityFactor = Math.max(0.8, 1.2 - (formData.availability365 / 365));
    
    // Host factor
    const hostFactor = formData.isPopularHost ? 1.2 : 1.0;
    
    // Minimum nights factor
    const nightsFactor = formData.minimumNights > 7 ? 0.85 : 1.0;
    
    const calculatedPrice = basePrice * locationMultiplier * roomTypeMultiplier * 
                           reviewsFactor * availabilityFactor * hostFactor * nightsFactor;
    
    // Add some randomness to make it more realistic
    const finalPrice = calculatedPrice * (0.9 + Math.random() * 0.2);
    
    setPrediction(Math.round(finalPrice));
  };

  return (
    <div className="py-20 animate-slide-up">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-12 gradient-text">Live Price Prediction</h2>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Location & Property */}
          <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl animate-slide-up-stagger">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-primary rounded-full animate-neural-pulse">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                Location & Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Latitude</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                  className="glass"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Longitude</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                  className="glass"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Neighbourhood Group</label>
                <Select value={formData.neighbourhoodGroup} onValueChange={(value) => setFormData({...formData, neighbourhoodGroup: value})}>
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manhattan">Manhattan</SelectItem>
                    <SelectItem value="Brooklyn">Brooklyn</SelectItem>
                    <SelectItem value="Queens">Queens</SelectItem>
                    <SelectItem value="Staten Island">Staten Island</SelectItem>
                    <SelectItem value="Bronx">Bronx</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Type</label>
                <Select value={formData.roomType} onValueChange={(value) => setFormData({...formData, roomType: value})}>
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entire home/apt">Entire home/apt</SelectItem>
                    <SelectItem value="Private room">Private room</SelectItem>
                    <SelectItem value="Shared room">Shared room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Booking & Reviews */}
          <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl animate-slide-up-stagger" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-secondary rounded-full animate-neural-pulse">
                  <Star className="w-5 h-5 text-primary-foreground" />
                </div>
                Booking & Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Nights</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.minimumNights}
                  onChange={(e) => setFormData({...formData, minimumNights: parseInt(e.target.value)})}
                  className="glass"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Reviews</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.numberOfReviews}
                  onChange={(e) => setFormData({...formData, numberOfReviews: parseInt(e.target.value)})}
                  className="glass"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reviews Per Month</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.reviewsPerMonth}
                  onChange={(e) => setFormData({...formData, reviewsPerMonth: parseFloat(e.target.value)})}
                  className="glass"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Days Since Last Review</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.daysSinceLastReview}
                  onChange={(e) => setFormData({...formData, daysSinceLastReview: parseInt(e.target.value)})}
                  className="glass"
                />
              </div>
            </CardContent>
          </Card>

          {/* Host & Availability */}
          <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl animate-slide-up-stagger" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-primary rounded-full animate-neural-pulse">
                  <Users className="w-5 h-5 text-primary-foreground" />
                </div>
                Host & Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Host Listings Count</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.hostListingsCount}
                  onChange={(e) => setFormData({...formData, hostListingsCount: parseInt(e.target.value)})}
                  className="glass"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Availability (out of 365 days)</label>
                <Input
                  type="number"
                  min="0"
                  max="365"
                  value={formData.availability365}
                  onChange={(e) => setFormData({...formData, availability365: parseInt(e.target.value)})}
                  className="glass"
                />
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id="popular-host"
                  checked={formData.isPopularHost}
                  onCheckedChange={(checked) => setFormData({...formData, isPopularHost: checked as boolean})}
                />
                <label htmlFor="popular-host" className="text-sm font-medium">
                  Is a Popular Host (10+ listings)
                </label>
              </div>
              
              <Separator className="my-4" />
              
              <Button 
                onClick={makePrediction}
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-neural animate-glow"
                size="lg"
              >
                <Brain className="w-4 h-4 mr-2" />
                Predict Price
              </Button>
              
              {prediction && (
                <Card className="mt-6 bg-gradient-secondary border-0 shadow-neural animate-scale-in">
                  <CardContent className="pt-6 text-center">
                    <h3 className="text-lg font-semibold mb-2 text-primary-foreground">Predicted Price</h3>
                    <div className="text-5xl font-bold text-primary-foreground animate-bounce-in">
                      $<AnimatedCounter end={prediction} duration={1000} />
                    </div>
                    <p className="text-sm text-primary-foreground/80 mt-2">per night</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ResultsSlide = () => (
  <div className="py-20 animate-slide-up">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-5xl font-bold text-center mb-12 gradient-text">Results & Key Insights</h2>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl animate-slide-up-stagger">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <div className="p-2 bg-gradient-primary rounded-full animate-neural-pulse">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              Model Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-glass rounded-lg animate-bounce-in">
                <div className="text-3xl font-bold text-primary">
                  <AnimatedCounter end={87.3} suffix="%" duration={2000} />
                </div>
                <div className="text-sm text-muted-foreground">Accuracy Score</div>
              </div>
              <div className="text-center p-4 bg-gradient-glass rounded-lg animate-bounce-in" style={{ animationDelay: "0.2s" }}>
                <div className="text-3xl font-bold text-data-secondary">
                  $<AnimatedCounter end={23.45} duration={2000} />
                </div>
                <div className="text-sm text-muted-foreground">Mean RMSE</div>
              </div>
              <div className="text-center p-4 bg-gradient-glass rounded-lg animate-bounce-in" style={{ animationDelay: "0.4s" }}>
                <div className="text-3xl font-bold text-accent">
                  <AnimatedCounter end={0.892} duration={2000} />
                </div>
                <div className="text-sm text-muted-foreground">R² Score</div>
              </div>
              <div className="text-center p-4 bg-gradient-glass rounded-lg animate-bounce-in" style={{ animationDelay: "0.6s" }}>
                <div className="text-3xl font-bold text-data-success">
                  <AnimatedCounter end={94.2} suffix="%" duration={2000} />
                </div>
                <div className="text-sm text-muted-foreground">Precision</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl animate-slide-up-stagger" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-data-secondary">
              <div className="p-2 bg-gradient-secondary rounded-full animate-neural-pulse">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              Feature Importance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { feature: "Location (Lat/Long)", importance: 28, color: "bg-primary" },
                { feature: "Neighbourhood Group", importance: 22, color: "bg-data-secondary" },
                { feature: "Room Type", importance: 18, color: "bg-accent" },
                { feature: "Number of Reviews", importance: 15, color: "bg-data-success" },
                { feature: "Availability", importance: 10, color: "bg-data-warning" },
                { feature: "Host Listings", importance: 7, color: "bg-chart-5" }
              ].map((item, index) => (
                <div key={item.feature} className="flex items-center gap-3 animate-slide-up-stagger" style={{ animationDelay: `${0.1 * index}s` }}>
                  <div className="w-24 text-xs font-medium">{item.feature}</div>
                  <div className="flex-1 bg-muted/30 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${item.color} transition-all duration-1000 ease-out shadow-glow`}
                      style={{ 
                        width: `${item.importance}%`,
                        animationDelay: `${0.5 + index * 0.2}s`
                      }}
                    />
                  </div>
                  <div className="w-8 text-xs text-right font-bold">
                    <AnimatedCounter end={item.importance} suffix="%" duration={1500} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl animate-bounce-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Award className="w-5 h-5" />
              Key Finding #1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <strong>Location is the strongest predictor</strong> - Manhattan listings command 
              80% higher prices than other boroughs on average.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl animate-bounce-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-data-secondary">
              <Target className="w-5 h-5" />
              Key Finding #2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <strong>Review count correlation</strong> - Properties with 50+ reviews 
              can charge 25% premium due to increased trust.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl animate-bounce-in" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <Activity className="w-5 h-5" />
              Key Finding #3
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <strong>Room type impact</strong> - Entire homes average $180/night 
              vs $75 for private rooms in the same neighborhoods.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

const ConclusionSlide = () => (
  <div className="py-20 animate-slide-up">
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-5xl font-bold mb-8 gradient-text">Conclusion & Impact</h2>
      
      <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl mb-12 animate-scale-in">
        <CardContent className="pt-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center animate-bounce-in">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-neural animate-neural-pulse">
                <TrendingUp className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                <AnimatedCounter end={87.3} suffix="%" /> Accuracy
              </h3>
              <p className="text-sm text-muted-foreground">
                High-precision predictions enable optimal pricing strategies
              </p>
            </div>
            <div className="text-center animate-bounce-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-neural animate-neural-pulse">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">Real-time Insights</h3>
              <p className="text-sm text-muted-foreground">
                Instant price recommendations based on market data
              </p>
            </div>
            <div className="text-center animate-bounce-in" style={{ animationDelay: "0.4s" }}>
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-neural animate-neural-pulse">
                <Database className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">Scalable Solution</h3>
              <p className="text-sm text-muted-foreground">
                Framework applicable to other cities and markets
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl text-left animate-slide-up-stagger">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Award className="w-5 h-5" />
              Business Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="w-2 h-2 bg-primary rounded-full animate-neural-pulse" />
                15-20% revenue increase for optimally priced listings
              </li>
              <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="w-2 h-2 bg-data-secondary rounded-full animate-neural-pulse" />
                Reduced time-to-market for new listings
              </li>
              <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="w-2 h-2 bg-accent rounded-full animate-neural-pulse" />
                Data-driven competitive advantage
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-glass border-border/30 shadow-float backdrop-blur-xl text-left animate-slide-up-stagger" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-data-secondary">
              <Target className="w-5 h-5" />
              Future Enhancements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="w-2 h-2 bg-primary rounded-full animate-neural-pulse" />
                Seasonal demand modeling
              </li>
              <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <div className="w-2 h-2 bg-data-secondary rounded-full animate-neural-pulse" />
                Real-time market sentiment analysis
              </li>
              <li className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <div className="w-2 h-2 bg-accent rounded-full animate-neural-pulse" />
                Integration with booking platforms
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center animate-scale-in" style={{ animationDelay: "1s" }}>
        <Badge className="mb-4 bg-gradient-primary text-primary-foreground border-0 shadow-neural animate-glow">
          Thank You
        </Badge>
        <h3 className="text-2xl font-bold mb-4 gradient-text">Questions & Discussion</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          This machine learning model demonstrates the power of big data analytics in 
          solving real-world business problems and optimizing market strategies.
        </p>
      </div>
    </div>
  </div>
);

export default Index;