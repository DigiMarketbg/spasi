
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { Video } from '@/types/video';

const VideoSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(isMobile ? 1 : 3);

        if (error) throw error;
        setVideos(data as Video[] || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [isMobile]);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-background">
      <div className="container mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Доброто</h2>
          <p className="text-muted-foreground">Вдъхновяващи видеа, които показват силата на доброто</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(isMobile ? 1 : 3).fill(0).map((_, idx) => (
              <div key={idx} className="aspect-video w-full rounded-lg overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video) => {
              const videoId = getYouTubeVideoId(video.youtube_url);
              return (
                <div key={video.id} className="glass rounded-lg overflow-hidden">
                  <div className="aspect-video w-full">
                    {videoId && (
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-1">{video.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Все още няма публикувани видеа.</p>
          </div>
        )}
        
        {videos.length > 0 && (
          <div className="flex justify-center mt-8">
            <Link to="/videos">
              <Button 
                variant="outline" 
                className="group flex items-center gap-2 border-spasi-red/50 bg-soft-purple/10 hover:bg-soft-purple/20"
              >
                <span>Виж всички видеа</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoSection;
