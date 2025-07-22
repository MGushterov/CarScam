import { useEffect, useState } from 'react';
import Nav from '../common/Nav';
import Footer from '../common/Footer';
import AnnSection from './AnnSection';
import SearchBar from './SearchBar';
import { useSearchParams } from 'react-router-dom';

const AnnPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [searchMakeUsed, setSearchMakeUsed] = useState(false);

    const [searchParams] = useSearchParams();

    const typeFilter = searchParams.get('type') || '';

    useEffect(() => {
        const handleAnnouncements = () => {
            if (!searchMakeUsed) {
                try {
                    let url = '/api/announcements'
                    if (typeFilter) {
                        url += `?type=${typeFilter}`;
                    }

                    fetch(url, { credentials: 'include' })
                        .then(res => res.json())
                        .then(({ data }) => setAnnouncements(data))
                        .catch(console.error);
                }
                catch (e) {
                    console.error(e.message)
                }
            }
        }

        handleAnnouncements();
    }, [searchMakeUsed]);

    return (
        <div className='h-screen'>
            <Nav />
            <main className='flex flex-col justify-around items-center h-[80%]'>
                <SearchBar 
                    setAnnouncements={setAnnouncements}
                    setSearchMakeUsed={setSearchMakeUsed}
                />
                {announcements && <AnnSection 
                    announcements={announcements}
                />}
            </main>
            <Footer />
        </div>
    );
}

export default AnnPage