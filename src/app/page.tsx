import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

function HomePage() {
  return (
    <main>
      <div className="w-full h-[100vh] flex flex-col justify-start items-center text-center bg-[#c0fcf7] p-5">
        <div className='max-w-[500px]'>
          <Image 
            src="/FPLibreLogo-bg-removed.png"
            alt='Fantasy Premier Libre Logo'
            width={1024}
            height={1024}
          />
        </div>
        <div className="w-full">
          <h1 className='text-[35px] font-[800]'>The Home of Free Fantasy Premier League Tools</h1>
        </div>
        <div className=' bg-teal-200 shadow cursor-pointer p-2 tex-[20px] rounded-md mt-10'>
          <Link href="/squad" className='text-[18px] font-[600]'>
            Get Started
          </Link>
        </div>
        
      </div>
    </main>
  )
}

export default HomePage