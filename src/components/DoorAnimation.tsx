import React, { useEffect, useRef, useState } from 'react';

interface DoorAnimationProps {
  backgroundImage: string;
}

const DoorAnimation: React.FC<DoorAnimationProps> = ({ backgroundImage }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress (0 to 1)
      const scrollDistance = windowHeight + height;
      const scrolled = windowHeight - top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollDistance));
      
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Animation phases
  const doorProgress = Math.min(1, scrollProgress * 2); // 0-0.5 of total progress
  const zoomProgress = Math.max(0, Math.min(1, (scrollProgress - 0.5) * 2)); // 0.5-1.0 of total progress
  
  // Door sliding positions (0% to 100%)
  const leftDoorPosition = doorProgress * 100;
  const rightDoorPosition = doorProgress * 100;
  
  // Zoom level (1 to 1.5)
  const zoomLevel = 1 + (zoomProgress * 0.5);
  
  // Text opacity (fades out as doors open)
  const textOpacity = 1 - doorProgress;
  
  // Japanese pattern for door frames
  const japanesePattern = "https://static.vecteezy.com/system/resources/thumbnails/022/009/369/small_2x/wavy-seamless-geometric-asian-background-vector.jpg";
  
  return (
    <div 
      ref={containerRef}
      className="relative h-[300vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[#1a1209]">
        {/* Background image with zoom effect */}
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${zoomLevel})`,
            opacity: doorProgress > 0 ? doorProgress : 0,
            transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
          }}
        />
        
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* Door container */}
        <div className="absolute inset-0 flex">
          {/* Left sliding door */}
          <div 
            className="w-1/2 h-full origin-left"
            style={{
              transform: `translateX(-${leftDoorPosition}%)`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <div className="h-full w-full relative">
              {/* Main door panel with Japanese pattern */}
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `url('${japanesePattern}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.85) sepia(0.2)'
                }}
              ></div>
              
              {/* Shoji grid pattern */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-6 gap-[2px] p-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div 
                    key={`left-panel-${i}`} 
                    className="border border-[#5d4037] bg-[#f5f2e9] bg-opacity-10"
                  ></div>
                ))}
              </div>
              
              {/* Door handle */}
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2 w-6 h-24 bg-[#2a1a0a] rounded-full border-2 border-[#1a0d05] shadow-md">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2 h-16 bg-[#1a0d05] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right sliding door */}
          <div 
            className="w-1/2 h-full origin-right"
            style={{
              transform: `translateX(${rightDoorPosition}%)`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <div className="h-full w-full relative">
              {/* Main door panel with Japanese pattern */}
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `url('${japanesePattern}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.85) sepia(0.2)'
                }}
              ></div>
              
              {/* Shoji grid pattern */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-6 gap-[2px] p-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div 
                    key={`right-panel-${i}`} 
                    className="border border-[#5d4037] bg-[#f5f2e9] bg-opacity-10"
                  ></div>
                ))}
              </div>
              
              {/* Door handle */}
              <div className="absolute left-8 top-1/2 transform -translate-y-1/2 w-6 h-24 bg-[#2a1a0a] rounded-full border-2 border-[#1a0d05] shadow-md">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2 h-16 bg-[#1a0d05] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Text overlay - centered and contained within the door opening */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-white"
          style={{ 
            opacity: textOpacity,
            transition: 'opacity 0.3s ease-out'
          }}
        >
          <div className="max-w-md text-center px-4">
            <h1 className="text-4xl md:text-5xl font-serif mb-6">
              Enter the World of Bonsai
            </h1>
            <p className="text-lg md:text-xl">
              Scroll to discover the ancient art of harmony and balance
            </p>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-12 animate-bounce">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div 
          className="absolute bottom-4 left-0 right-0 flex justify-center"
          style={{ 
            opacity: scrollProgress < 0.8 ? 1 : 1 - ((scrollProgress - 0.8) * 5),
            transition: 'opacity 0.3s ease-out'
          }}
        >
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoorAnimation;
