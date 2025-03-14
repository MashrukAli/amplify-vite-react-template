import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getStrapiImageUrl } from '../services/strapiService';
import Masonry from './Masonry';
import Typewriter from 'typewriter-effect';

interface BlogListProps {
  posts: any[];
  hideMasonry?: boolean;
  useInfiniteScroll?: boolean;
  itemsPerPage?: number;
}

const BlogList: React.FC<BlogListProps> = ({ 
  posts, 
  hideMasonry = false, 
  useInfiniteScroll = false,
  itemsPerPage = 9 // Default to 3x3 grid
}) => {
  console.log('Posts in BlogList:', posts);
  
  // Add state for tracking visibility of different sections
  const [isVisible, setIsVisible] = useState(false);
  const [isMasonryVisible, setIsMasonryVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const masonryRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Pagination and infinite scroll states
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedPosts, setDisplayedPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate total pages
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  
  // Load initial posts
  useEffect(() => {
    const initialPosts = posts.slice(0, itemsPerPage);
    setDisplayedPosts(initialPosts);
    setHasMore(posts.length > itemsPerPage);
  }, [posts, itemsPerPage]);
  
  // Load more posts function for infinite scroll
  const loadMorePosts = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newPosts = posts.slice(startIndex, endIndex);
      
      setDisplayedPosts(prevPosts => [...prevPosts, ...newPosts]);
      setCurrentPage(nextPage);
      setHasMore(endIndex < posts.length);
      setIsLoading(false);
    }, 800);
  }, [currentPage, hasMore, isLoading, itemsPerPage, posts]);
  
  // Handle pagination page change
  const handlePageChange = (page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedPosts(posts.slice(startIndex, endIndex));
    setCurrentPage(page);
  };
  
  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!useInfiniteScroll || !loadMoreRef.current) return;
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(loadMoreRef.current);
    
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMorePosts, hasMore, isLoading, useInfiniteScroll]);
  
  useEffect(() => {
    // Observer for the blog cards section
    const cardsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          cardsObserver.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );
    
    // Observer for the masonry section
    const masonryObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMasonryVisible(true);
          masonryObserver.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );
    
    if (sectionRef.current) {
      cardsObserver.observe(sectionRef.current);
    }
    
    if (masonryRef.current && !hideMasonry) {
      masonryObserver.observe(masonryRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        cardsObserver.unobserve(sectionRef.current);
      }
      if (masonryRef.current && !hideMasonry) {
        masonryObserver.unobserve(masonryRef.current);
      }
    };
  }, [hideMasonry]);
  
  // Prepare data for Masonry component
  const masonryData = posts
    .filter(post => post && post.MainImage && post.MainImage.url)
    .slice(0, 10)
    .map((post, index) => ({
      id: post.documentId || post.id || index,
      image: getStrapiImageUrl(post.MainImage),
      height: 200 + Math.floor(Math.random() * 200) // Random heights between 200-400px
    }));
  
  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center mt-12 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-emerald-700 text-white hover:bg-emerald-600'
          }`}
        >
          Previous
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 rounded-full ${
              currentPage === page
                ? 'bg-emerald-700 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-emerald-700 text-white hover:bg-emerald-600'
          }`}
        >
          Next
        </button>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Hero Section with Masonry and Typing Effect - Only show if hideMasonry is false */}
      {!hideMasonry && (
        <div className="min-h-[70vh] flex flex-col md:flex-row items-center">
          {/* Left side - Typing effect */}
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-serif mb-6 text-white">
              <Typewriter
                options={{
                  strings: ['Bonsai Rental', 'Nature in Miniature', 'Living Art', 'Tranquility'],
                  autoStart: true,
                  loop: true,
                  delay: 75,
                  deleteSpeed: 50,
                }}
              />
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Experience the tranquility of nature with our premium bonsai collection.
              Each tree is a living work of art, carefully cultivated to bring harmony to your space.
            </p>
            <a 
              href="#collection" 
              className="inline-block bg-emerald-700 text-white px-6 py-3 border border-emerald-800 hover:bg-emerald-600 transition-colors"
            >
              Explore Collection
            </a>
          </div>
          
          {/* Right side - Masonry with visibility trigger */}
          <div 
            ref={masonryRef}
            className="w-full md:w-1/2 h-[70vh] overflow-hidden transition-all duration-1000 ease-out"
            style={{ 
              opacity: isMasonryVisible ? 1 : 0,
              transform: isMasonryVisible ? 'translateX(0)' : 'translateX(50px)'
            }}
          >
            {isMasonryVisible && masonryData.length > 0 && (
              <Masonry data={masonryData} />
            )}
          </div>
        </div>
      )}

      {/* Introduction Section */}
      <div id="collection" className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-serif mb-6 text-white">Our Bonsai Collection</h2>
        <p className="max-w-2xl mx-auto text-gray-400 mb-12">
          Each bonsai in our collection has been carefully cultivated and maintained to represent 
          the perfect balance between nature and art. Browse our selection and find your perfect companion.
        </p>
      </div>

      {/* Gallery Grid - With scroll animation */}
      <div 
        ref={sectionRef}
        className={`container mx-auto px-4 pb-16 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPosts && displayedPosts.length > 0 ? (
            displayedPosts.map((post, index) => {
              // Use documentId instead of id for the link
              const postId = post.documentId || post.id;
              
              return (
                <Link 
                  to={`/bonsai/${postId}`} 
                  key={`${postId}-${index}`} 
                  className="group bg-gray-900 overflow-hidden shadow-lg hover:shadow-emerald-900/40 transition-all duration-300 border-t border-emerald-800"
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'opacity 800ms ease-out, transform 800ms ease-out'
                  }}
                >
                  {post.MainImage && post.MainImage.url && (
                    <div className="h-72 overflow-hidden relative">
                      <img
                        src={getStrapiImageUrl(post.MainImage)}
                        alt={post.Title || post.Type || "Bonsai image"}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="p-6 border-l-2 border-emerald-700">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-serif text-white tracking-wide">{post.Title || post.Type}</h3>
                      <p className="text-emerald-400 font-medium text-xl">${post.Price}<span className="text-sm text-emerald-600">/month</span></p>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-gray-500 uppercase tracking-widest text-xs">{post.Type}</p>
                      <span className="text-emerald-400 flex items-center text-sm uppercase tracking-wider font-light">
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-400">
              <p>No bonsai listings found. Please add some in the Strapi admin.</p>
            </div>
          )}
        </div>
        
        {/* Infinite scroll loading indicator */}
        {useInfiniteScroll && hasMore && (
          <div 
            ref={loadMoreRef} 
            className="flex justify-center items-center py-12"
          >
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">Loading more bonsai...</p>
              </div>
            ) : (
              <button 
                onClick={loadMorePosts}
                className="px-6 py-3 bg-emerald-700 text-white hover:bg-emerald-600 transition-colors"
              >
                Load More
              </button>
            )}
          </div>
        )}
        
        {/* Pagination - Only show if not using infinite scroll */}
        {!useInfiniteScroll && renderPagination()}
      </div>
    </div>
  );
};

export default BlogList;