import React, { useContext, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ENDPOINTS, useConnectionConfig, useStore } from '@oyster/common';
import { useLocation } from 'react-router';
import { useSolPrice } from '../../contexts';

export const GOOGLE_ANALYTICS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'G-HLNC4C2YKN';

interface AnalyticsUserProperties {
  // user dimensions
  user_id: string; // google reserved
  pubkey: string; // same as user_id, but for use in custom reports
}
interface CustomEventDimensions {
  // event dimensions
  store_domain: string;
  store_title: string;
  storefront_pubkey: string;
  is_store_owner: boolean;
  network: string; // mainnet, devnet, etc.
  // metrics
  sol_value?: number;
}

const AnalyticsContext = React.createContext<{
  configureAnalytics: (options: CustomEventDimensions) => void;
  pageview: (path: string) => void;
  track: (action: string, attributes: { [key: string]: any }) => void;
} | null>(null);

// @ts-ignore
const gtag = window.gtag;

export function AnalyticsProvider(props: { children: React.ReactNode }) {
  const { publicKey } = useWallet();
  const { storefront } = useStore();
  const { endpoint } = useConnectionConfig();
  const location = useLocation();
  const solPrice = useSolPrice();

  // user pubkey / id
  const pubkey = publicKey?.toBase58() || '';
  const endpointName = ENDPOINTS.find(e => e.endpoint === endpoint)?.name;
  useEffect(() => {
    // const isStoreOwner = ownerAddress === publicKey?.toBase58();

    setUserProperties({
      user_id: pubkey,
      pubkey: pubkey,
    });

    // initial config
    configureAnalytics({
      is_store_owner: pubkey === storefront.pubkey, // isStoreOwner,
      network: endpointName,
      store_domain: storefront.subdomain,
      store_title: storefront.meta.title,
      storefront_pubkey: storefront.pubkey,
    });
  }, [pubkey, endpointName]);

  useEffect(() => {
    pageview(location.pathname);
  }, [location]);

  function setUserProperties(attributes: AnalyticsUserProperties) {
    gtag('set', 'user_properties', {
      ...attributes,
    });
  }

  function configureAnalytics(options: Partial<CustomEventDimensions>) {
    if (!gtag) return;
    gtag('config', GOOGLE_ANALYTICS_ID, {
      ...options,
      send_page_view: false,
    });
  }

  function pageview(path: string) {
    if (!gtag) return;
    gtag('event', 'page_view', {
      page_location: window.location.href, // important to overwrite to keep fragments
      page_path: path, // React router provides the # route as a regular path
    });
  }

  function track(
    action: string,
    attributes?: {
      category?: string;
      label?: string;
      value?: number;
      sol_value?: number;
      [key: string]: string | number | undefined | any[];
    } & Partial<CustomEventDimensions>,
  ) {
    if (!gtag) return;
    gtag('event', action, {
      event_category: attributes?.category,
      event_label: attributes?.label,
      ...(attributes?.sol_value && solPrice
        ? {
            value: attributes.sol_value * solPrice, //Google Analytics likes this one in USD :)
            sol_value: attributes.sol_value,
          }
        : {
            value: attributes?.value,
          }),
      ...attributes,
    });
  }

  return (
    <AnalyticsContext.Provider
      value={{
        configureAnalytics,
        track,
        pageview,
      }}
    >
      {props.children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === null) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
