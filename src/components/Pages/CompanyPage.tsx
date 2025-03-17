import React, { useEffect, useRef, useState } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
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
      className="mb-24"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: `opacity 0.8s ease-out ${delay}s, transform 1.2s ease-out ${delay}s`
      }}
    >
      {children}
    </div>
  );
};

const ParallaxImage: React.FC<{src: string; alt: string}> = ({ src, alt }) => {
  const [offset, setOffset] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;
      
      const { top } = imageRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate parallax effect
      if (top < windowHeight && top > -windowHeight) {
        const newOffset = (top - windowHeight) * 0.15;
        setOffset(newOffset);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div ref={imageRef} className="relative h-96 overflow-hidden rounded-xl shadow-2xl">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${src})`,
          transform: `translateY(${offset}px) scale(1.1)`,
          transition: 'transform 0.1s ease-out'
        }}
        aria-label={alt}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    </div>
  );
};

const CompanyPage: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      const progress = scrollTop / (documentHeight - windowHeight);
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-gray-200 pt-24 pb-16">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black z-50">
        <div 
          className="h-full bg-emerald-500"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
      
      <div className="container mx-auto px-4 md:px-8">
        {/* Hero Section */}
        <div className="relative h-[50vh] mb-24 flex items-center justify-center overflow-hidden rounded-xl">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1507988914355-bf49fdbc7368?q=80&w=2071')`,
              filter: 'brightness(0.4)'
            }}
          />
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-serif mb-6 text-white">
              Our <span className="text-emerald-400">Story</span>
            </h1>
            <p className="text-2xl md:text-3xl italic">
              "Cultivating nature's art, one bonsai at a time."
            </p>
          </div>
        </div>
        
        {/* Company History */}
        <AnimatedSection>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-8 text-emerald-400 relative">
                Our History
                <span className="absolute bottom-0 left-0 w-24 h-1 bg-emerald-400 mt-2"></span>
              </h2>
              <p className="text-lg md:text-xl mb-8 leading-relaxed">
                Founded in 1985 by master bonsai artist Takeshi Yamada, our company has been dedicated to sharing the beauty and tranquility of bonsai with the world. With a passion for this ancient art form and a commitment to excellence, we have grown from a small local nursery to a renowned international bonsai rental service.
              </p>
              <p className="text-lg md:text-xl leading-relaxed">
                Over the years, we have curated a diverse collection of bonsai trees, each with its own unique story and character. Our expert team of bonsai artists carefully nurtures and maintains these living sculptures, ensuring that they thrive in their new environments.
              </p>
            </div>
            <ParallaxImage 
              src="https://images.unsplash.com/photo-1610219542098-fd8cf67b0a4a?q=80&w=2070" 
              alt="Bonsai garden"
            />
          </div>
        </AnimatedSection>
        
        {/* Our Philosophy */}
        <AnimatedSection delay={0.2}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ParallaxImage 
              src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2073" 
              alt="Zen garden"
            />
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-8 text-emerald-400 relative">
                Our Philosophy
                <span className="absolute bottom-0 left-0 w-24 h-1 bg-emerald-400 mt-2"></span>
              </h2>
              <p className="text-lg md:text-xl mb-8 leading-relaxed">
                We believe that bonsai is more than just a plant—it's a living art form that embodies harmony, patience, and respect for nature. Each tree in our collection represents years of careful cultivation and artistic vision.
              </p>
              <p className="text-lg md:text-xl leading-relaxed">
                Our mission is to bring the tranquility and beauty of these miniature landscapes into spaces where they can be appreciated by all. We take pride in connecting people with nature and bringing a touch of zen to homes, offices, and events around the globe.
              </p>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Our Team */}
        <AnimatedSection delay={0.4}>
          <h2 className="text-3xl md:text-4xl font-serif mb-12 text-emerald-400 text-center relative">
            Our Expert Team
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-emerald-400 mt-2"></span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Takeshi Yamada",
                role: "Founder & Master Artist",
                image: "https://c8.alamy.com/comp/2G7FT6P/default-avatar-photo-placeholder-grey-profile-picture-icon-man-in-t-shirt-2G7FT6P.jpg"
              },
              {
                name: "Mei Lin",
                role: "Lead Bonsai Curator",
                image: "https://c8.alamy.com/comp/2G7FT6P/default-avatar-photo-placeholder-grey-profile-picture-icon-man-in-t-shirt-2G7FT6P.jpg"
              },
              {
                name: "James Wilson",
                role: "Botanical Specialist",
                image: "https://c8.alamy.com/comp/2G7FT6P/default-avatar-photo-placeholder-grey-profile-picture-icon-man-in-t-shirt-2G7FT6P.jpg"
              }
            ].map((member, index) => (
              <div 
                key={index} 
                className="bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <div className="h-80 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-emerald-400 mb-4">{member.role}</p>
                  <p className="text-gray-400 text-sm">
                    With over 15 years of experience in bonsai cultivation, {member.name.split(" ")[0]} brings exceptional 
                    expertise and passion to our team. Specializing in traditional techniques and innovative approaches.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
        
        {/* Visit Us */}
        <AnimatedSection delay={0.6}>
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-8 md:p-12 mt-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif mb-8 text-emerald-400">Visit Our Garden</h2>
                <p className="text-lg md:text-xl mb-6">
                  Experience the tranquility of our bonsai garden in person. Our peaceful sanctuary is open to visitors who wish to immerse themselves in the art of bonsai.
                </p>
                <div className="text-lg md:text-xl">
                  <p className="mb-2">
                    <span className="text-emerald-400 mr-2">Address:</span> 
                    Bonsai Rental Co.<br />
                    1234 Evergreen Lane<br />
                    Kyoto, Japan 123-4567
                  </p>
                  <p className="mb-2">
                    <span className="text-emerald-400 mr-2">Hours:</span> 
                    Monday - Friday: 9am - 5pm<br />
                    Saturday: 10am - 4pm<br />
                    Sunday: Closed
                  </p>
                  <button className="mt-6 bg-emerald-700 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg transition-colors">
                    Schedule a Visit
                  </button>
                </div>
              </div>
              <div className="h-96 rounded-xl overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3268.2834485535454!2d135.7681463!3d35.0116363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600108ae918b02ef%3A0xb61a446e74a21c08!2sKyoto%2C%20Japan!5e0!3m2!1sen!2sus!4v1651234567890!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bonsai Garden Location"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default CompanyPage;