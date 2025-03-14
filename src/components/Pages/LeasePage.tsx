import React, { useEffect, useState, useRef } from 'react';

const LeasePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  // Use a single state for all sections
  const [visibleSections, setVisibleSections] = useState({
    service: false,
    flow: false,
    faq: false
  });
  
  // Refs for scroll animations
  const serviceRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  
  // State for FAQ accordion
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  
  // Toggle FAQ accordion
  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };
  
  // FAQ data
  const faqItems = [
    {
      question: "How long can I rent a bonsai?",
      answer: "Our rental periods are flexible, starting from one month with options to extend. Many clients choose to rent for 3-6 months, while others maintain longer relationships with their bonsai companions."
    },
    {
      question: "Do you provide care instructions?",
      answer: "Absolutely! Each bonsai comes with detailed care instructions specific to its species. We also offer ongoing support via email or phone if you have any questions about caring for your rented bonsai."
    },
    {
      question: "What if the bonsai gets damaged?",
      answer: "We understand accidents happen. Our rental agreement includes a reasonable wear policy. Minor issues are covered, but significant damage may incur additional fees. We recommend placing your bonsai in a safe location away from pets and high-traffic areas."
    },
    {
      question: "Can I purchase a bonsai I've been renting?",
      answer: "Yes! If you form a special bond with your rented bonsai, we offer a rent-to-own option. A portion of your rental payments can be applied toward the purchase price if you decide to make it a permanent addition to your home."
    },
    {
      question: "Do you deliver the bonsai?",
      answer: "Yes, we offer delivery services within a 25-mile radius of our location. For special arrangements or locations outside this area, please contact us directly to discuss options."
    }
  ];
  
  // Rental flow steps
  const rentalSteps = [
    {
      title: "Browse & Select",
      description: "Explore our collection and choose a bonsai that resonates with your space and aesthetic preferences.",
      icon: "🔍"
    },
    {
      title: "Consultation",
      description: "Schedule a brief consultation where we'll discuss placement, lighting, and care requirements for your selected bonsai.",
      icon: "💬"
    },
    {
      title: "Delivery & Setup",
      description: "We'll deliver your bonsai to your location and help position it in the optimal spot for both aesthetics and health.",
      icon: "🚚"
    },
    {
      title: "Enjoy & Learn",
      description: "Experience the tranquility and beauty of your bonsai while learning about its care and history.",
      icon: "🌿"
    },
    {
      title: "Ongoing Support",
      description: "Our team remains available for any questions or concerns throughout your rental period.",
      icon: "📱"
    }
  ];

  useEffect(() => {
    // Force initial render with a short delay
    const initialTimer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    // Create a single observer for all sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // Check which section is intersecting
          if (entry.isIntersecting) {
            if (entry.target === serviceRef.current) {
              setVisibleSections(prev => ({ ...prev, service: true }));
            } else if (entry.target === flowRef.current) {
              setVisibleSections(prev => ({ ...prev, flow: true }));
            } else if (entry.target === faqRef.current) {
              setVisibleSections(prev => ({ ...prev, faq: true }));
            }
            
            // Once visible, no need to observe anymore
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        root: null, 
        rootMargin: '0px', 
        threshold: 0.1  // Lower threshold for easier triggering
      }
    );
    
    // Delay the observation to ensure DOM is ready
    const observerTimer = setTimeout(() => {
      if (serviceRef.current) observer.observe(serviceRef.current);
      if (flowRef.current) observer.observe(flowRef.current);
      if (faqRef.current) observer.observe(faqRef.current);
    }, 100);
    
    return () => {
      clearTimeout(initialTimer);
      clearTimeout(observerTimer);
      observer.disconnect();
    };
  }, []);

  // Force visibility after a timeout as a fallback
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setVisibleSections({
        service: true,
        flow: true,
        faq: true
      });
    }, 1000);
    
    return () => clearTimeout(fallbackTimer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-gray-800 rounded-full mb-8"></div>
          <div className="h-6 w-48 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 pt-24">
      {/* Service Explanation Section */}
      <div 
        ref={serviceRef} 
        className="min-h-screen bg-black py-16 px-4 md:px-8 flex items-center"
      >
        <div 
          className={`container mx-auto transition-opacity duration-1000 ease-out ${
            visibleSections.service ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl font-serif mb-6 text-white">Bonsai Rental Service</h1>
            <p className="max-w-3xl mx-auto text-gray-400 mb-12 text-lg">
              Experience the tranquility and beauty of ancient bonsai art without the long-term commitment of ownership. 
              Our premium bonsai rental service brings living art into your space, carefully curated and maintained by our experts.
              Whether for your home, office, or special event, our bonsai trees create an atmosphere of peace and natural elegance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div 
              className={`bg-gray-900 p-8 rounded-lg border border-gray-800 hover:border-emerald-800 transition-colors transition-transform duration-1000 ease-out ${
                visibleSections.service ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="text-4xl mb-4 text-emerald-500">🏡</div>
              <h3 className="text-xl font-medium mb-3 text-white">Home Rentals</h3>
              <p className="text-gray-400">
                Transform your living space with the timeless beauty of a bonsai. Our home rentals include monthly care guidance.
              </p>
            </div>
            
            <div 
              className={`bg-gray-900 p-8 rounded-lg border border-gray-800 hover:border-emerald-800 transition-colors transition-transform duration-1000 ease-out ${
                visibleSections.service ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="text-4xl mb-4 text-emerald-500">🏢</div>
              <h3 className="text-xl font-medium mb-3 text-white">Corporate Spaces</h3>
              <p className="text-gray-400">
                Enhance your office or business environment with the calming presence of professionally maintained bonsai trees.
              </p>
            </div>
            
            <div 
              className={`bg-gray-900 p-8 rounded-lg border border-gray-800 hover:border-emerald-800 transition-colors transition-transform duration-1000 ease-out ${
                visibleSections.service ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <div className="text-4xl mb-4 text-emerald-500">🎉</div>
              <h3 className="text-xl font-medium mb-3 text-white">Event Styling</h3>
              <p className="text-gray-400">
                Create memorable experiences with bonsai displays for special events, photoshoots, or temporary installations.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rental Flow Section */}
      <div 
        ref={flowRef} 
        className="min-h-screen bg-gray-900 py-16 px-4 md:px-8 flex items-center"
      >
        <div 
          className={`container mx-auto transition-opacity duration-1000 ease-out ${
            visibleSections.flow ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2 className="text-3xl font-serif mb-16 text-center text-white">The Rental Process</h2>
          
          <div className="max-w-4xl mx-auto">
            {rentalSteps.map((step, index) => (
              <div 
                key={index} 
                className={`flex mb-12 items-start transition-transform duration-1000 ease-out ${
                  visibleSections.flow ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex-shrink-0 w-16 h-16 bg-emerald-900 rounded-full flex items-center justify-center text-2xl mr-6">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white flex items-center">
                    <span className="text-emerald-400 mr-2">{index + 1}.</span> {step.title}
                  </h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <a 
              href="#contact" 
              className={`inline-block bg-emerald-700 text-white px-8 py-3 rounded-lg hover:bg-emerald-600 transition-colors transition-transform duration-1000 ease-out ${
                visibleSections.flow ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: '1000ms' }}
            >
              Start Your Bonsai Journey
            </a>
          </div>
        </div>
      </div>
      
      {/* FAQ Section with Accordion */}
      <div 
        ref={faqRef} 
        className="min-h-screen bg-black py-16 px-4 md:px-8 flex items-center"
      >
        <div 
          className={`container mx-auto transition-opacity duration-1000 ease-out ${
            visibleSections.faq ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2 className="text-3xl font-serif mb-16 text-center text-white">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className={`mb-4 border border-gray-800 rounded-lg overflow-hidden transition-transform duration-1000 ease-out ${
                  visibleSections.faq ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <button
                  className="w-full text-left p-4 bg-gray-900 flex justify-between items-center hover:bg-gray-800 transition-colors"
                  onClick={() => toggleQuestion(index)}
                >
                  <span className="text-lg font-medium text-white">{item.question}</span>
                  <svg 
                    className={`w-6 h-6 transform transition-transform ${activeQuestion === index ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    activeQuestion === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-4 bg-gray-800 text-gray-300">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div 
            className={`text-center mt-12 text-gray-400 transition-transform duration-1000 ease-out ${
              visibleSections.faq ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            <p>Have more questions? Feel free to <a href="#contact" className="text-emerald-400 hover:underline">contact us</a>.</p>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif mb-6 text-white">Ready to Bring Nature's Art Into Your Space?</h2>
          <p className="max-w-2xl mx-auto text-gray-400 mb-8">
            Experience the beauty and tranquility of bonsai without the long-term commitment. 
            Our expert team will help you select the perfect tree for your environment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/collection" 
              className="bg-emerald-700 text-white px-8 py-3 rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Browse Collection
            </a>
            <a 
              href="#contact" 
              className="bg-transparent border border-emerald-700 text-emerald-400 px-8 py-3 rounded-lg hover:bg-emerald-900 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeasePage;