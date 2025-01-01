import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  path?: string;
  noindex?: boolean;
}

export function SEO({
  title = 'DevToolbox - Free Developer Tools',
  description = 'Free online developer tools for JSON formatting, text manipulation, encoding/decoding, and more. Fast, secure, and easy to use.',
  keywords = 'json formatter, text tools, developer tools, encoding, decoding, hash generator, regex tester',
  path = '',
  noindex = false,
}: SEOProps) {
  const siteUrl = import.meta.env.VITE_APP_URL || 'https://devtoolbox.app';
  const fullUrl = `${siteUrl}${path}`;
  const siteName = 'DevToolbox';
  const gtmId = import.meta.env.VITE_GTM_ID || 'GTM-XXXXXXX';
  const adsenseId = import.meta.env.VITE_ADSENSE_CLIENT_ID;

  return (
    <Helmet>
      {/* Google Tag Manager */}
      <script>
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');`}
      </script>

      {/* Google AdSense */}
      <script 
        async 
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
        crossOrigin="anonymous"
      />

      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* OpenGraph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={`${siteUrl}/og-image.png`} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}/og-image.png`} />

      {/* Additional Meta Tags */}
      <meta name="application-name" content={siteName} />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="theme-color" content="#ffffff" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      
      {/* Core Web Vitals & Performance Monitoring Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
      <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      
      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: siteName,
          url: siteUrl,
          description,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          }
        })}
      </script>
    </Helmet>
  );
} 