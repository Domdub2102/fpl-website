'use client'

import React from "react"
import styles from "./Navbar.module.css"

export default function Hamburger(){
    return(
        <>
            <div className={styles.hamburger}>
                <div 
                    className={styles.burger}
                />
                <div 
                    className={styles.burger}
                />
                <div 
                    className={styles.burger}
                />
            </div>
        </>
    )
}