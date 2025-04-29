export default function Key() {
    return (
        <div className='relative w-[220px] h-[32px] md:h-[50px] lg:h-[50px]'>
            <div className='absolute right-0 w-full h-full md:h-3/5 lg:h-3/5 grid grid-cols-5 font-bold gap-[1px] pb-[1px]'>
                <div className='border-none rounded-sm bg-green-700 text-gray-200 flex items-center justify-center'>1</div>
                <div className='border-none rounded-sm bg-green-300 text-black flex items-center justify-center'>2</div>
                <div className='border-none rounded-sm bg-gray-300 text-black flex items-center justify-center'>3</div>
                <div className='border-none rounded-sm bg-red-400 text-black flex items-center justify-center'>4</div>
                <div className='border-none rounded-sm bg-red-700 text-gray-200 flex items-center justify-center'>5</div>
            </div>
            <span className='absolute left-[-40px] lg:left-0 lg:bottom-0 md:left-0 md:bottom-0 font-[500]'>Easy</span>
            <span className='absolute right-[-62px] lg:right-0 lg:bottom-0 md:right-0 md:bottom-0 font-[500]'>Difficult</span>
        </div>
    )
}