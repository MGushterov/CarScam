import React from 'react';

export default function AnnouncementDescription({ description }) {
    return (
        <div
            className='text-white font-quicksand text-sm md:text-base text-center announcement-description'
            dangerouslySetInnerHTML={{ __html: description }}
        />
    );
}
