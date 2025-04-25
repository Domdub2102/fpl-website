export default function Key() {
    return (
        <div className='relative w-[260px] h-[50px]'>
            <span className='absolute top-[3px] left-4 font-[500]'>Key:</span>
            <div className='absolute right-0 w-4/5 h-3/5 grid grid-cols-5 font-bold gap-[1px] pb-[1px]'>
                <div className='border-none rounded-sm bg-green-700 text-gray-200 flex items-center justify-center'>1</div>
                <div className='border-none rounded-sm bg-green-300 text-black flex items-center justify-center'>2</div>
                <div className='border-none rounded-sm bg-gray-300 text-black flex items-center justify-center'>3</div>
                <div className='border-none rounded-sm bg-red-400 text-black flex items-center justify-center'>4</div>
                <div className='border-none rounded-sm bg-red-700 text-gray-200 flex items-center justify-center'>5</div>
            </div>
            <span className='absolute left-[52px] bottom-0 font-[500]'>Easy</span>
            <span className='absolute right-0 bottom-0 font-[500]'>Difficult</span>
        </div>
    )
}