import { Link } from 'react-router-dom';
import { getImageUrl } from '../../util/getImageUrl';

const AnnSmall = ({ announcementId, userId, make, price, manufactureYear, engine, photo }) => {
    return (
        <Link className='h-full w-full' to={`/announcements/${userId}/${announcementId}`}>
            <section className='h-full w-full flex justify-between items-center p-4 shadow-md shadow-black rounded-4xl'>
                {photo && <img 
                    src={getImageUrl(photo.path)}
                    className='h-auto w-[40%] rounded-md'
                />}
                <div className='h-full w-[60%] flex flex-col justify-around items-center'>
                    <h1 className='text-black font-bold font-playfair'>
                        {make}
                    </h1>
                    <h2 className='text-sky-600 font-bold font-playfair'>
                        Price: {price} EUR
                    </h2>
                    <h3 className='text-zinc-700 font-quicksand'>
                        {manufactureYear}
                    </h3>
                    <h4 className='text-zinc-700 font-quicksand'>
                        Engine: {engine}
                    </h4>
                </div>
            </section>
        </Link>
    );
}

export default AnnSmall;