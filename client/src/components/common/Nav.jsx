import { useState } from 'react';
import { Link } from 'react-router-dom';
import getCookieValue from '../../util/cookies';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
    const [userId, setUserId] = useState(getCookieValue('userId'));
    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/signout', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            if (!res.ok) {
                throw new Error(res.status)
            }

            setUserId(null)
            navigate('/');
            confirm('Signed out successfully')
        }
        catch (e) {
            console.error(e);
        }
    }

    const navElements = <div>
        <ul className= 'flex items-center justify-evenly h-full mx-2 min-w-[60%]'>
            <Link to='/'>
                <li className='text-white mx-6 md:text-md lg:text-lg hover:text-amber-400 hover:scale-110 font-playfair'>
                    Home
                </li>
            </Link>
            <Link to='/announcements'>
                <li className='text-white mx-6 md:text-md lg:text-lg hover:text-amber-400 hover:scale-110 font-playfair'>
                    Announcements
                </li>
            </Link>
            {userId && <Link to={`/${userId}/myannouncements`}>
                <li className='text-white mx-6 md:text-md lg:text-lg hover:text-amber-400 hover:scale-110 font-playfair'>
                    My announcements
                </li>
            </Link>}
            {/* {userId && <Link to={`/${userId}/profile`}>
                <li className='text-white mx-6 md:text-md lg:text-lg hover:text-amber-400 hover:scale-110 font-playfair'>
                    Account
                </li>
            </Link>} */}
        </ul>
    </div>

    const signInButton = <div className='flex items-center h-full md:h-3/4 max-sm:w-[90px] sm:w-[120px] md:w-[181px] lg:w-1/9 mr-4'>
        <Link to='/signin' className='h-3/5 w-full mr-1'>
            <button className='h-full w-full rounded-[3rem] bg-amber-400 text-white max-sm:text-sm lg:text-xl font-playfair font-bold hover:bg-amber-200 hover:h-[95%] hover:w-[95%]'>
                Sign In
            </button>
        </Link>
    </div>

    const signOutButton = <div className='flex items-center h-full md:h-3/4 max-sm:w-[90px] sm:w-[120px] md:w-[181px] lg:w-1/9 mr-4'>
        <button className='h-full w-full rounded-[3rem] bg-amber-400 
            text-white max-sm:text-sm lg:text-xl font-playfair font-bold 
            hover:bg-amber-200 hover:h-[95%] hover:w-[95%]'
            onClick={handleSignout}
        >
            Sign Out
        </button>
    </div>

    return (
        <nav className='h-[15%] min-h-36 flex-shrink-0 w-full bg-sky-600 flex justify-between items-center px-4 py-1'>
            {navElements}
            {userId ? signOutButton : signInButton}
        </nav>
    );
}

export default Nav;