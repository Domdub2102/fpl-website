import React, { ReactNode} from 'react'
import Link from 'next/link'
import styles from './Navbar.module.css'

interface NavbarLogoProps {
    children: ReactNode
}

const NavbarLogo: React.FC<NavbarLogoProps> = ({ children }) => {
  return (
    <Link href="/" className={styles.navbarLogo}>{children}</Link>
  )
}

export default NavbarLogo