import React from 'react'
import NavbarLink from './NavbarLink'
import NavbarLogo from './NavbarLogo'

// imports classes as properties of the styles object
import styles from './Navbar.module.css'

const Navbar = () => {
  return (
    <div className={styles.navbar}>
        <NavbarLogo>FPLibre</NavbarLogo>
        <div className=''>
          <NavbarLink href="/gameweeks">Gameweeks</NavbarLink>
          <NavbarLink href="/players">Players</NavbarLink>
          <NavbarLink href="/teams">Teams</NavbarLink>
          <NavbarLink href="/login">Login</NavbarLink>
          <NavbarLink href="/test">Test</NavbarLink>
        </div>
    </div>
  )
}

export default Navbar