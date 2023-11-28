import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";

/**
 * Navigation bar that shows up on all pages.
 * Rendered in _app.tsx file above the page content.
 */
export function Navbar() {
  const address = useAddress();

  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <Link href="/" className={`${styles.homeLink} ${styles.navLeft}`}>
            <Image
              src="/logo.png"
              width={48}
              height={48}
              alt="NFT marketplace sample logo"
            />
          </Link>

          <div className={styles.navMiddle}>
            <Link href="/" className={styles.link}>
              Homepage
            </Link>
            <Link href="/collections" className={styles.link}>
              Collections
            </Link>
            <Link href="/buy" className={styles.link}>
              Explore
            </Link>
            <Link href="/sell" className={styles.link}>
              Sell
            </Link>
            <Link href="/mintable" className={styles.link}>
              Create A NFT
            </Link>
            {address && (
              <Link className={styles.link} href={`/profile/${address}`}>
                Profile
              </Link>
            )}
          </div>
        </div>

        <div className={styles.navRight}>
          <div className={styles.navConnect}>
            <ConnectWallet theme="dark" btnTitle="Connect Wallet" hideTestnetFaucet={true} switchToActiveChain={false} welcomeScreen={{
              title: "Welcome To MCT Marketplace",
              subtitle: "This marketplace made with 💙  by Solazan for MCT Project",
              img: {
                src: "./_next/image?url=%2Fhero-asset.png&w=1080&q=100",
                width: 300
              },
            }} />
          </div>

        </div>
      </nav>
    </div>
  );
}
