import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Navbar } from "../components/Navbar/Navbar";
import NextNProgress from "nextjs-progressbar";
import { NETWORK } from "../const/contractAddresses";
import Head from 'next/head';
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const pageTitle = pageProps.title ? `${pageProps.title} | MCT Marketplace` : "MCT Marketplace";
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={NETWORK}
    >
      {/* Progress bar when navigating between pages */}
      <NextNProgress
        color="var(--color-tertiary)"
        startPosition={0.5}
        stopDelayMs={500}
        height={10}
        showOnShallow={true}
      />
      <Head>
        <title>{pageTitle}</title>
      </Head>
      {/* Render the navigation menu above each component */}
      <Navbar />
      {/* Render the actual component (page) */}
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
