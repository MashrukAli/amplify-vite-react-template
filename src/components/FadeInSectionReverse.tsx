import React, { useEffect, useRef, useState } from 'react';

interface FadeInSectionReverse {
  image: string;
  title: string;
  description: string;
}

const FadeInSectionReverse: React.FC<FadeInSectionReverse> = ({ image, title, description }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the section is 20% visible, trigger the animation
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
      }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={sectionRef}
      className="min-h-screen bg-black py-16 px-4 md:px-8 flex items-center"
    >
      <div 
        className={`container mx-auto transition-opacity duration-1000 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          {/* Image on the right */}
          <div 
            className={`w-full md:w-1/2 transition-transform duration-1000 ease-out ${
              isVisible ? 'translate-x-0' : 'translate-x-24'
            }`}
          >
            <div className="relative overflow-hidden rounded-lg shadow-xl">
              <img 
                src={image} 
                alt={title}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          </div>
          
          {/* Description on the left */}
          <div 
            className={`w-full md:w-1/2 text-white transition-transform duration-1000 ease-out delay-300 ${
              isVisible ? 'translate-x-0' : '-translate-x-24'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-emerald-400">{title}</h2>
            <div className="prose prose-lg prose-invert">
              <p className="text-gray-300 mb-6">{description}</p>
              <button className="bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FadeInSectionReverse;