'use client'

import React from 'react'
import NavbarLogo from './NavbarLogo'
import NavbarDropdown from './NavbarDropdown'
import NavbarLinks from './NavbarLinks'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  // Define the breakpoint (e.g., 768px for mobile)
  const breakpoint = 768;

  React.useEffect(() => {
    // Function to check window width
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check on mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className={styles.navbar}>
        <NavbarLogo>FPLibre</NavbarLogo>
        {isMobile && <NavbarDropdown />}
        {!isMobile && <NavbarLinks />}
    </div>
  )
}

export default Navbar