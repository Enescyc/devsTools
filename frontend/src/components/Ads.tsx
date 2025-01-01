import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;

  useEffect(() => {
    try {
      if (!clientId || !slot || !containerRef.current) {
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
  }, [clientId, slot, toast]);

  if (!clientId || !slot) {
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
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        data-adtest={import.meta.env.DEV ? 'on' : 'off'}
      />
    </div>
  );
} 