'use client'

import React, { ReactNode } from 'react'
import Link from 'next/link'
import styles from './Navbar.module.css'

interface NavbarLinkProps {
    href: string
    children: ReactNode
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ href, children }) => {
  return (
    <Link href={href} className={styles.navbarLink}>{children}</Link>
  )
}

export default NavbarLink