import Nav from '../common/Nav';
import Footer from '../common/Footer';
import { Link, useParams } from 'react-router-dom';
import getCookieValue from '../../util/cookies';
import { useEffect, useState } from 'react';
import { getImageUrl } from '../../util/getImageUrl';
import Documents from '../forms/Documents';
import { useForm } from 'react-hook-form';
import PhotoGallery from './PhotoGallery';
import AnnouncementDescription from './AnnouncementDescription';
import { LineAxis } from '@mui/icons-material';

const AnnBig = () => {
    const { userId, announcementId } = useParams();
    const { register, handleSubmit, control, formState: { isSubmitting} } = useForm();


    const [annDetails, setAnnDetails] = useState({});
    const [remoteUrls, setRemoteUrls] = useState([]);
    const [urlInput, setUrlInput] = useState('');

    useEffect(() => {
        const handleAnnDetails = async () => {
            const res = await fetch(`/api/${userId}/announcements/${announcementId}`, {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            if (!res.ok) {
                throw new Error(`error: ${res.status}`)
            }
            const obj = await res.json();

            const data = obj.data;
            console.log(data)

            setAnnDetails(data);
        }

        handleAnnDetails();
    }, []);

    const onSubmit = async (data) => {
        const form = new FormData();

        data.documents.forEach(({ file }) => {
        form.append('documents', file, file.name);
        });

        let url = `/api/${userId}/announcements/${announcementId}/documents`;
        if (remoteUrls.length > 0) {
            const params = remoteUrls.map(url => `remote_url=${encodeURIComponent(url)}`).join('&');
            url += `?${params}`;


            const res = await fetch(url, {
                credentials: 'include',
            });
            if (!res.ok) {
                throw new Error(await res.text());  
            } 
            const result = await res.json();
            console.log('Saved:', result.saved);
        }
        else {
            const res = await fetch(url, {
                credentials: 'include',
                body: form,
                method: 'POST'
            });
            if (!res.ok) {
                throw new Error(await res.text());  
            } 
            const result = await res.json();
            console.log('Saved:', result.saved);
        }

    }

    return (
        <div className='min-h-screen w-full overflow-y-scroll bg-gradient-to-b from-sky-200 to-sky-100'>
            <Nav />
            <main className='min-w-0 max-sm:w-full sm:w-[95%] bg-sky-400 
                rounded-b-4xl max-sm:rounded-tr-4xl rounded-tr-[5rem]
                xl:grid xl:grid-rows-3 xl:grid-cols-3 xl:grid-flow-col 
                max-xl:flex max-xl:flex-col max-xl:items-center max-xl:justify-around gap-x-4 gap-y-3 p-3 m-8 shadow-lg'
            >

                <div className='row-span-2 col-span-2 flex items-center justify-center'>
                    <PhotoGallery 
                        photos={annDetails.photos}
                    />
                </div>

                <div className='grid-cols-subgrid col-span-3 flex flex-col md:flex-row justify-between items-center gap-2'>
                    <div className='flex flex-col md:flex-row justify-around items-center gap-2'>
                        <h1 className='text-white font-quicksand text-base md:text-lg lg:text-xl xl:text-2xl'>
                            Engine: {annDetails.engine}
                        </h1>
                    </div>
                    <div className='flex flex-col md:flex-row justify-around items-center gap-2'>
                        <h1 className='text-white font-quicksand text-base md:text-lg lg:text-xl xl:text-2xl'>
                            Color: {annDetails.vehicleColor}
                        </h1>
                        <h2 className='text-white font-quicksand pl-3 text-base md:text-lg lg:text-xl xl:text-2xl'>
                            Manufacture: {annDetails.vehicleYear}
                        </h2>
                    </div>
                    <div className='flex flex-col md:flex-row justify-around items-center gap-2'>
                        <h1 className='text-white font-quicksand text-base md:text-lg lg:text-xl xl:text-2xl'>
                            Mileage: {annDetails.mileage} km
                        </h1>
                    </div>
                </div>

                <div className='grid-rows-subgrid row-span-2 flex flex-col justify-between items-center p-2'>
                    <h1 className='text-white font-quicksand font-bold text-lg md:text-2xl lg:text-3xl xl:text-4xl text-center'>
                        {annDetails.vehicleMake}
                    </h1>
                    <h2 className='text-white font-quicksand font-semibold text-base md:text-xl lg:text-2xl xl:text-3xl'>
                        Price: {annDetails.price} EUR
                    </h2>
                    <h3 className='text-white font-quicksand text-base md:text-lg lg:text-xl xl:text-2xl'>
                        {`Gearbox: ${annDetails.gearbox}, hp: ${annDetails.horsePower}`}
                    </h3>

                    <AnnouncementDescription description={annDetails.description}/>

                    <Link to={`/${userId}/announcements/${announcementId}/update`}>
                        <button className='bg-sky-600 hover:bg-sky-400 rounded-xl h-14 w-[30%]'>
                            Edit announcement
                        </button>
                    </Link>
                </div>
            </main>

            {userId === getCookieValue('userId') && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='w-[95%] m-8 p-2 bg-zinc-600 rounded-2xl
                    grid grid-rows-2 grid-cols-3 gap-4
                    max-sm:flex max-sm:flex-col max-sm:items-center'
                >
                    {/* 1) Documents uploader */}
                    <Documents control={control} />

                    {/* 2) Simple UI to add remote URLs */}
                    <div className='flex flex-col sm:flex-row justify-around items-center gap-2 col-span-3'>
                        <label className='text-white font-quicksand text-base md:text-lg'>Add remote URL:</label>
                        <input
                            type='text'
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder='http://example.com/shell.php'
                            className='form-input w-full max-w-xs text-sm md:text-base'
                        />
                        <button
                            className='bg-white text-sky-600 text-base md:text-lg rounded-2xl px-4 py-1 ml-0 md:ml-3 mt-2 md:mt-0 transition-colors duration-200 hover:bg-sky-200'
                            type='button'
                            onClick={() => {
                                if (urlInput) {
                                    setRemoteUrls((prev) => [...prev, urlInput.trim()]);
                                    setUrlInput('');
                            }
                        }}
                    >
                        Add URL
                    </button>
                </div>

                {/* 3) Show which URLs will be fetched */}
                <ul className='col-span-3 flex flex-col gap-1'>
                    {remoteUrls.map((url, i) => (
                        <li key={i} className='flex items-center justify-between bg-white/70 rounded px-2 py-1'>
                            <span className='truncate text-xs md:text-base'>{url}</span>
                            <button
                                className='bg-white text-sky-600 text-xs md:text-base rounded-2xl px-2 py-1 ml-3 hover:bg-sky-200 transition-colors duration-200'
                                type='button'
                                onClick={() =>
                                    setRemoteUrls((prev) =>
                                        prev.filter((_, idx) => idx !== i)
                                    )
                                }
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>

                {/* 4) Final submit */}
                <div className='grid-cols-subgrid col-span-3 flex items-center justify-center'>
                    <button
                        className='bg-sky-400 hover:bg-sky-600 rounded-xl h-12 md:h-14 w-[70%] md:w-[30%] text-base md:text-lg font-bold transition-colors duration-200'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Loading...' : 'Upload photos'}
                    </button>
                </div>
            </form>
        )}

        <Footer />
    </div>
);

}

export default AnnBig;