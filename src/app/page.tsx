import React from 'react'
import styles from './HomePage.module.css'

function HomePage() {
  return (
    <main>
      <div className={styles.hero}>
        <div className={styles.heading}>
          <h1>The Home of Free FPL Tools</h1>
          <button>Login</button>
        </div>
        <div className={styles.image}>
          Add image here
        </div>
      </div>
    </main>
  )
}

export default HomePage