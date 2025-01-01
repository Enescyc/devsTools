import { ReactNode, useEffect, useState, memo } from 'react';
import { Ads } from './Ads';

interface AdLayoutProps {
  children: ReactNode;
}

const FooterAd = memo(() => {
  const [isAdBlockEnabled, setIsAdBlockEnabled] = useState(false);
  const [adsenseLoaded, setAdsenseLoaded] = useState(false);

  useEffect(() => {
    // Check if AdSense script is loaded
    const checkAdsenseLoaded = () => {
      if (window.adsbygoogle) {
        setAdsenseLoaded(true);
      }
    };

    // Check for ad blockers
    const checkAdBlocker = async () => {
      try {
        await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
          method: 'HEAD',
          mode: 'no-cors'
        });
        setIsAdBlockEnabled(false);
      } catch {
        setIsAdBlockEnabled(true);
      }
    };

    checkAdBlocker();
    checkAdsenseLoaded();

    // Check again after a delay to ensure script has time to load
    const timeout = setTimeout(checkAdsenseLoaded, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-[728px] mx-auto">
          {isAdBlockEnabled ? (
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Please disable your ad blocker to support our free tools.
              </p>
            </div>
          ) : (
            <>
              <Ads
                slot={import.meta.env.VITE_ADSENSE_SLOT_FOOTER}
                format="horizontal"
                style={{ 
                  width: '728px',
                  height: '90px',
                  maxWidth: '100%',
                  margin: '0 auto'
                }}
                className="bg-muted rounded-lg p-4"
              />
              {!adsenseLoaded && (
                <div className="text-center mt-2">
                  <p className="text-sm text-muted-foreground">
                    Loading advertisement...
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </footer>
  );
});

FooterAd.displayName = 'FooterAd';

export function AdLayout({ children }: AdLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer Ad Component */}
      <FooterAd />
    </div>
  );
} 