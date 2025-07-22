import { useEffect, useState } from 'react';
import { getImageUrl } from '../../util/getImageUrl';

const PhotoGallery = ({ photos }) => {
    const [currPhoto, setCurrPhoto] = useState(undefined);

    useEffect(() => {
        if (photos && photos.length > 0) {
            setCurrPhoto(photos[0]);
        }
    }, [photos])
    
    const getPrev = () => {
        setCurrPhoto((prev) => {
            const idx = photos.findIndex(photo => photo.id === prev.id);
            if (idx === 0) {
                return photos[photos.length - 1]
            }
            return photos[idx - 1]
        });
    }

    const getNext = () => {
        setCurrPhoto((prev) => {
            const idx = photos.findIndex(photo => photo.id === prev.id);
            if (idx === photos.length - 1) {
                return photos[0]
            }
            return photos[idx + 1]
        });
    }

    return (
        <div className='h-full w-full flex items-center justify-between gap-4 min-w-0 flex-nowrap'>
            <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-12 cursor-pointer'
                onClick={getPrev}
            >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
            </svg>

            {currPhoto && (
                <img
                    className='max-sm:h-56 sm:h-80 md:h-[25rem] lg:h-[30rem] w-auto rounded-4xl shadow-zinc-900 shadow-lg object-contain'
                    src={getImageUrl(currPhoto.path)}
                    alt=''
                />
            )}

            <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-12 cursor-pointer'
                onClick={getNext}
            >
                <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
            </svg>
        </div>
    );
}

export default PhotoGallery;