import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Image as DreiImage, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { fetchBonsaiList } from '../../services/strapiService';
import BlogList from '../BlogList';

// For the default view with pagination (3x3 grid):
// <BlogList posts={posts} />
// For infinite scroll:
// <BlogList posts={posts} useInfiniteScroll={true} />
// For the CollectionPage without Masonry:
// <BlogList posts={posts} hideMasonry={true} />
// You can also customize the items per page:
// <BlogList posts={posts} itemsPerPage={12} />
// 3D Image component for the gallery
const Image = ({ url, ...props }: { url: string; [key: string]: any }) => {
  const ref = React.useRef<THREE.Mesh>();
  const [hovered, setHovered] = useState(false);
  const color = new THREE.Color();

  useFrame(() => {
    if (ref.current && ref.current.material) {
      // Check if material is an array
      const material = Array.isArray(ref.current.material) 
        ? ref.current.material[0] 
        : ref.current.material;
      
      // Cast material to any to access color property
      const materialWithColor = material as THREE.MeshBasicMaterial;
      if (materialWithColor.color) {
        materialWithColor.color.lerp(
          color.set(hovered ? 'white' : '#ccc'), 
          hovered ? 0.4 : 0.05
        );
      }
    }
  });

  return (
    <DreiImage
      ref={ref as React.RefObject<THREE.Mesh>}
      url={url}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      {...props}
    />
  );
};

// Enhanced Gallery component with depth effects
const BonsaiGallery = () => {
  const { height } = useThree((state) => state.viewport);
  const data = useScroll();
  const group = React.useRef<THREE.Group>(null);
  
  // Use placeholder images that don't have CORS issues
  const bonsaiImages = [
    'https://picsum.photos/id/152/800/800',
    'https://picsum.photos/id/153/800/800',
    'https://picsum.photos/id/154/800/800',
    'https://picsum.photos/id/155/800/800',
    'https://picsum.photos/id/156/800/800'
  ];

  useFrame(() => {
    const scroll = data.offset; // Value between 0 and 1
    
    if (group.current && group.current.children.length > 0) {
      // Faster parallax effect - increased speed multiplier
      group.current.position.y = scroll * height * 1.2;
      
      // Faster zoom effect on images
      (group.current.children[0] as any).material.zoom = 1 + data.range(0, 1/3) / 2;
      (group.current.children[1] as any).material.zoom = 1 + data.range(0, 1/3) / 2;
      (group.current.children[2] as any).material.zoom = 1 + data.range(1.15/3, 1/3) / 2;
      (group.current.children[3] as any).material.zoom = 1 + data.range(1.15/3, 1/3) / 1.5;
      (group.current.children[4] as any).material.zoom = 1 + data.range(1.25/3, 1/3) / 0.8;
      
      // Faster rotation effect based on scroll
      group.current.rotation.z = scroll * 0.2;
    }
  });

  return (
    <group ref={group}>
      {/* Main images with depth positioning */}
      <Image position={[-2, 0, 0]} scale={[4, height * 0.8, 1]} url={bonsaiImages[0]} />
      <Image position={[2, 0, 1]} scale={3} url={bonsaiImages[1]} />
      <Image position={[-2.3, -height * 0.6, 2]} scale={[1, 3, 1]} url={bonsaiImages[2]} />
      <Image position={[-0.6, -height * 0.8, 3]} scale={[1, 2, 1]} url={bonsaiImages[3]} />
      <Image position={[0.75, -height * 0.7, 3.5]} scale={1.5} url={bonsaiImages[4]} />
    </group>
  );
};

// HTML content for the 3D scroll section
const ScrollText = () => {
  return (
    <>
      <h1 style={{ position: 'absolute', top: '20vh', left: '10vw', color: 'white', fontSize: '5vw', fontFamily: 'serif' }}>
        Bonsai
      </h1>
      <h1 style={{ position: 'absolute', top: '60vh', left: '60vw', color: 'white', fontSize: '5vw', fontFamily: 'serif' }}>
        Art
      </h1>
      <h1 style={{ position: 'absolute', top: '120vh', left: '20vw', color: 'white', fontSize: '5vw', fontFamily: 'serif' }}>
        Nature
      </h1>
      <div style={{ position: 'absolute', bottom: '10vh', left: '50%', transform: 'translateX(-50%)', color: 'white', textAlign: 'center' }}>
        <p>Scroll to explore our collection</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce mt-2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </>
  );
};

// Main CollectionPage component
const CollectionPage: React.FC = () => {
  const [_scrolledPast3D, setScrolledPast3D] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [leftTextVisible, setLeftTextVisible] = useState(false);
  const [rightTextVisible, setRightTextVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const headerRef = useRef<HTMLDivElement>(null);

  // Fetch bonsai data
  useEffect(() => {
    const loadBonsaiData = async () => {
      try {
        const bonsaiData = await fetchBonsaiList();
        setPosts(bonsaiData);
      } catch (error) {
        console.error('Failed to load bonsai data:', error);
      }
    };
    
    loadBonsaiData();
  }, []);

  // Handle scroll events to detect when user has scrolled past the 3D section
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollPosition = window.scrollY;
        const threshold = window.innerHeight * 0.9; // 90% of viewport height
        
        if (scrollPosition > threshold) {
          setScrolledPast3D(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for the header animations
  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLeftTextVisible(true);
          setTimeout(() => {
            setRightTextVisible(true);
          }, 300);
        }
      },
      {
        threshold: 0.3,
      }
    );
    
    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
    }
    
    return () => {
      if (headerRef.current) {
        headerObserver.unobserve(headerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-200" ref={scrollRef}>
      {/* Animated Header Text */}
      <div 
        ref={headerRef}
        className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-16"
      >
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl mx-auto">
          <div 
            className="md:w-1/2 md:text-right md:pr-8 mb-8 md:mb-0 transition-all duration-1000 ease-out"
            style={{ 
              opacity: leftTextVisible ? 1 : 0,
              transform: leftTextVisible ? 'translateX(0)' : 'translateX(-100px)'
            }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Discover the Art</h2>
            <p className="text-gray-400">
              Bonsai is more than just a plant—it's a living sculpture that embodies 
              centuries of tradition and meticulous care.
            </p>
          </div>
          
          <div 
            className="md:w-1/2 md:pl-8 transition-all duration-1000 ease-out"
            style={{ 
              opacity: rightTextVisible ? 1 : 0,
              transform: rightTextVisible ? 'translateX(0)' : 'translateX(100px)'
            }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Experience Tranquility</h2>
            <p className="text-gray-400">
              Each bonsai in our collection tells a unique story, bringing a sense of 
              peace and harmony to any space it inhabits.
            </p>
          </div>
        </div>
      </div>

      {/* Blog List Component - With infinite scroll enabled */}
      <div className="py-16">
        <BlogList 
          posts={posts} 
          hideMasonry={true} 
          useInfiniteScroll={true} 
          itemsPerPage={6} // Optional: adjust items per page for infinite scroll
        />
      </div>

      {/* 3D Scrolling Gallery at the end */}
      <div className="h-screen relative">
        <Canvas 
          gl={{ antialias: false }} 
          dpr={[1, 1.5]}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <ScrollControls damping={2.5} pages={1.5} distance={1}>
              <Scroll>
                <BonsaiGallery />
              </Scroll>
              <Scroll html>
                <ScrollText />
              </Scroll>
            </ScrollControls>
            <Preload />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default CollectionPage;