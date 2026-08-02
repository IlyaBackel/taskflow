import type { Board } from '../../types/board';

interface BoardHeaderProps {
    board: Board;
}

export default function BoardHeader({ board }: BoardHeaderProps) {
    return (
        <div className='w-full flex flex-col sm:flex-row'>
            <div className="relative h-48 sm:w-110 sm:h-56 md:w-120 md:h-74 lg:w-200 lg:h-90 rounded-xl overflow-hidden shadow-lg">
                <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${board.cover_image || '/not-found-image.svg'})`,
                    }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                <h1 className="absolute bottom-4 left-4 right-4 text-white text-2xl font-bold drop-shadow-lg">
                    {board.title}
                </h1>
            </div>
            <div className='flex flex-row items-center justify-center '>
                <p>Board Info</p>
            </div>
        </div>
    );
}