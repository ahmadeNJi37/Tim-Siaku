export default function Banner({message}){
    return (
        <div className='fixed inset-x-0 bottom-0 pointer-none sm:flex sm:justify-center sm:px-6 lg:px-8 lg:gb-5'>
            <div className="pointer-events-none flex item-center justify-between gap-x-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 px-6 py-2.5 sm:rounded-xl sm:py-3 sm:pl-4 sm:pr-3.5">
                <p className="text-sm leading-6 text-white">
                    <link href="#">
                        <strong className="font-bold">Pengumuman</strong>
                        {message}
                    </link>
                </p>

            </div>
        </div>
    )
}