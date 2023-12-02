import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useEffect, useState } from "react";

/**
 * Navigation bar that shows up on all pages.
 * Rendered in _app.tsx file above the page content.
 */
export function Navbar() {
  const address = useAddress();

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Check if running on the client side
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);

      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

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
              priority
            />
          </Link>

          <div className={styles.navMiddle} style={{ display: isMenuOpen || windowWidth >= 769 ? 'flex' : 'none' }}>
            <Link href="/" className={styles.link} onClick={closeMenu}>
              Homepage
            </Link>
            <Link href="/collections" className={styles.link} onClick={closeMenu}>
              Collections
            </Link>
            <Link href="/buy" className={styles.link} onClick={closeMenu}>
              Explore
            </Link>
            <Link href="/sell" className={styles.link} onClick={closeMenu}>
              Sell
            </Link>
            <Link href="/mintable" className={styles.link} onClick={closeMenu}>
              Create A NFT
            </Link>
            {address && (
              <Link className={styles.link} href={`/profile/${address}`} onClick={closeMenu}>
                Profile
              </Link>
            )}
          </div>
        </div>

        <div className={styles.navRight}>
          <div className={styles.hamburger} onClick={() => setMenuOpen(!isMenuOpen)} style={{ display: isMenuOpen || windowWidth >= 769 ? 'none' : 'block' }}>
            <span>&#9776;</span>
          </div>

          <div className={styles.navConnect}>
            <ConnectWallet
              theme="dark"
              btnTitle="Connect Wallet"
              hideTestnetFaucet={true}
              switchToActiveChain={false}
              welcomeScreen={{
                title: "Welcome To MCT Marketplace",
                subtitle: "This marketplace made with 💙 by Solazan for MCT Project",
                img: {
                  src: "./_next/image?url=%2Fhero-asset.png&w=1080&q=100",
                  width: 300,
                },
              }}
            />
          </div>
        </div>
      </nav>
    </div>
  );
}
