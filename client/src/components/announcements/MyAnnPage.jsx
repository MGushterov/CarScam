import { Link } from 'react-router-dom';
import Nav from '../common/Nav';
import AnnSection from './AnnSection';
import { useEffect, useState } from 'react';
import Footer from '../common/Footer';
import getCookieValue from '../../util/cookies';

const MyAnnPage = () => {
    const [userId, setUserId] = useState(getCookieValue('userId'));
    const [userAnnouncements, setUserAnnouncements] = useState([]);

    useEffect(() => {
        const handleUserAnnouncements = async () => {
            try {
                const res = await fetch(`/api/${userId}/announcements`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                if (!res.ok) {
                    throw new Error(`Error: ${res.status}`)
                }
                const obj = await res.json();
                setUserAnnouncements(obj.data);
            }
            catch (e) {
                console.error(e)
            }
        }

        handleUserAnnouncements();
    }, [userId])

    return (
        <div className='h-screen'>
            <Nav />
            <main className='flex flex-col justify-around items-center h-[80%]'>
                {userAnnouncements && <AnnSection 
                    announcements={userAnnouncements}
                />}
                <section className='flex justify-around items-center h-full w-full'>
                    <Link to={`/${userId}/myannouncements/create`} className='flex justify-around items-center bg-sky-600 rounded-4xl hover:scale-95'>
                        <div className='p-4'>
                            <h1 className='text-white text-6xl font-playfair font-bold'>
                                Create new announcement
                            </h1>
                        </div>
                    </Link>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default MyAnnPage;