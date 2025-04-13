
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample blog posts
const blogPosts = [
  {
    id: 1,
    title: 'Как да се подготвим за природни бедствия',
    excerpt: 'Важни стъпки, които всеки трябва да предприеме за подготовка при извънредни ситуации.',
    image: '/lovable-uploads/51ca99de-ee36-4025-b765-57c98ece14ec.png',
    date: '10 април 2025'
  },
  {
    id: 2,
    title: 'Доброволчеството в България - как да се включите',
    excerpt: 'Възможности за доброволчество и организации, които търсят помощ от доброволци.',
    image: '/lovable-uploads/51ca99de-ee36-4025-b765-57c98ece14ec.png',
    date: '5 април 2025'
  },
  {
    id: 3,
    title: 'Кръводаряването спасява животи - всичко, което трябва да знаете',
    excerpt: 'Процесът на кръводаряване, изисквания и защо е толкова важно.',
    image: '/lovable-uploads/51ca99de-ee36-4025-b765-57c98ece14ec.png',
    date: '1 април 2025'
  },
  {
    id: 4,
    title: 'Първа помощ - основни умения, които могат да спасят живот',
    excerpt: 'Научете основните техники за първа помощ и как да реагирате при спешни случаи.',
    image: '/lovable-uploads/51ca99de-ee36-4025-b765-57c98ece14ec.png',
    date: '25 март 2025'
  }
];

const BlogSection = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    
    const { scrollLeft, clientWidth } = carouselRef.current;
    const scrollTo = direction === 'left' 
      ? scrollLeft - clientWidth 
      : scrollLeft + clientWidth;
    
    carouselRef.current.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Блог статии</h2>
            <p className="text-muted-foreground">Полезна информация от нашия блог</p>
          </div>
          
          <div className="hidden sm:flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div 
          ref={carouselRef} 
          className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-none"
        >
          {blogPosts.map((post) => (
            <div 
              key={post.id} 
              className="min-w-[300px] md:min-w-[400px] glass rounded-xl overflow-hidden flex-shrink-0 snap-start"
            >
              <div className="h-48 bg-muted relative">
                <div 
                  className="absolute inset-0 bg-center bg-cover" 
                  style={{ backgroundImage: `url(${post.image})` }}
                />
              </div>
              
              <div className="p-5">
                <div className="text-sm text-muted-foreground mb-2">{post.date}</div>
                <h3 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary font-medium group"
                >
                  <span>Прочети</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
