import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { env, isDevelopment } from '@/config/env';

interface AdsProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function Ads({ slot, format = 'auto', style, className }: AdsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      if (!env.ads.enabled || !slot || !containerRef.current) {
        return;
      }

      // Initialize adsbygoogle if not already initialized
      if (typeof window.adsbygoogle === 'undefined') {
        window.adsbygoogle = [];
      }

      // Push the ad configuration
      window.adsbygoogle.push({});
    } catch (error) {
      console.error('Error loading AdSense ad:', error);
      toast({
        title: 'Ad Loading Error',
        description: 'There was an issue loading the advertisement.',
        variant: 'destructive',
      });
    }
  }, [slot, toast]);

  if (!env.ads.enabled || !slot) {
    return null;
  }

  return (
    <div ref={containerRef} className={className}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          overflow: 'hidden',
          ...style,
        }}
        data-ad-client={env.ads.clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        data-adtest={isDevelopment ? 'on' : 'off'}
      />
    </div>
  );
} 