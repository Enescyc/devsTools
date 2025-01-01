import { Helmet } from 'react-helmet-async';
import { env } from '@/config/env';

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
  const fullUrl = `${env.app.url}${path}`;
  const siteName = 'DevToolbox';

  return (
    <Helmet>
      {/* Google Tag Manager */}
      {env.analytics.enabled && (
        <script>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${env.analytics.gtmId}');`}
        </script>
      )}

      {/* Google AdSense */}
      {env.ads.enabled && (
        <script 
          async 
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.ads.clientId}`}
          crossOrigin="anonymous"
        />
      )}

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
      <meta property="og:image" content={`${env.app.url}/og-image.png`} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${env.app.url}/og-image.png`} />

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
      {env.analytics.enabled && (
        <>
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        </>
      )}
      {env.ads.enabled && (
        <>
          <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
          <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        </>
      )}
      
      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: siteName,
          url: env.app.url,
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