import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AdsProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function Ads({ slot, format = 'auto', style, className }: AdsProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  const hasInitialized = useRef(false);

  useEffect(() => {
    const loadAd = async () => {
      try {
        if (!clientId) {
          console.error('AdSense Client ID is not configured');
          return;
        }

        if (!slot) {
          console.error('Ad slot is not configured');
          return;
        }

        // Prevent multiple initializations
        if (hasInitialized.current) {
          return;
        }

        // Wait for AdSense script to load
        if (typeof window.adsbygoogle === 'undefined') {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Push the ad
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        hasInitialized.current = true;
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading AdSense ad:', error);
        toast({
          title: 'Ad Loading Error',
          description: 'There was an issue loading the advertisement.',
          variant: 'destructive',
        });
      }
    };

    loadAd();

    // Cleanup function
    return () => {
      hasInitialized.current = false;
      // Remove the ad if the component unmounts
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [slot, format, clientId, toast]);

  if (!clientId || !slot) {
    return null;
  }

  return (
    <div ref={adRef} className={className}>
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
        data-adtest={import.meta.env.DEV ? 'on' : 'off'} // Enable test ads in development
      />
      {!isLoaded && import.meta.env.DEV && (
        <div className="text-xs text-muted-foreground mt-2">
          Debug Info:
          <br />
          Client ID: {clientId.substring(0, 10)}...
          <br />
          Slot: {slot}
          <br />
          Format: {format}
        </div>
      )}
    </div>
  );
} 