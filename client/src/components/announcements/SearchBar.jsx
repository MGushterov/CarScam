import { useState, useEffect, useRef, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { handleGearboxes, handleTypes } from '../../util/apiCalls';
import { useForm } from 'react-hook-form';

const SearchBar = ({ setAnnouncements, setSearchMakeUsed }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth) 
    const [types, setTypes] = useState([]);
    const [gearboxes, setGearboxes] = useState([]);
    const [searchMake, setSearchMake] = useState('');

    const { register, handleSubmit, formState: { isSubmitting}  } = useForm({
        type: '',
        category: '',
        gearbox: '',
        priceRange: {
            minPrice: 0,
            maxPrice: Number.MAX_SAFE_INTEGER
        }
    })

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize)
    }, []);

    useEffect(() => {
        const loadEnums = async () => {
            const t = await handleTypes();
            const g = await handleGearboxes();

            setTypes(t);
            setGearboxes(g);
        }
        loadEnums();
  }, []);

    const debouncedSearch = useMemo(() =>
        debounce((query) => {
            fetch(`/api/announcements?make=${query}`)
                .then(response => response.json())
                .then(obj => {
                    setAnnouncements(obj.data)
                })
                .catch(error => {
                    console.error('Search error:', error);
                });
        }, 700)
    , [setAnnouncements]);

    const handleSearchChange = (event) => {
        const { value } = event.target;
        setSearchMake(value);
        if (value) {
            debouncedSearch(value);
            setSearchMakeUsed(true);
        } else {
            setSearchMake(null);
            setSearchMakeUsed(false);
        }
    }

    const onSubmit = async (formData) => {
        let url = '/api/announcements';

        const params = Object.entries(formData)
            .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        if (params) {
            url += `?${params}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const obj = await response.json();
            setAnnouncements(obj.data);
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    return (
        <section className='grid grid-cols-2 grid-rows-2 gap-4 w-full pb-2'>
            <form
                className='flex flex-wrap gap-4 justify-between items-center py-3 px-4 col-span-2 bg-zinc-100'
                onSubmit={handleSubmit(onSubmit)}
            >
                <select
                    {...register('type')}
                    className='rounded px-2 py-1 bg-white text-sky-600'
                    defaultValue=''
                >
                    <option value=''>-- Choose Type --</option>
                    {types.map(type => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>

                <select
                    {...register('category')}
                    className='rounded px-2 py-1 bg-white text-sky-600'
                    defaultValue=''
                >
                    <option value=''>-- Choose Category --</option>
                    {types.flatMap(type => type.categories).map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <select
                    {...register('gearbox')}
                    className='rounded px-2 py-1 bg-white text-sky-600'
                    defaultValue=''
                >
                    <option value=''>-- Choose Gearbox --</option>
                    {gearboxes.map(gb => (
                        <option key={gb.name} value={gb.name}>
                            {gb.value}
                        </option>
                    ))}
                </select>

                <input
                    type='number'
                    placeholder='Min. Price'
                    {...register('minPrice')}
                    className='rounded px-2 py-1 bg-white text-sky-600 w-24'
                />

                <input
                    type='number'
                    placeholder='Max. Price'
                    {...register('maxPrice')}
                    className='rounded px-2 py-1 bg-white text-sky-600 w-24'
                />

                <button type='submit' className='p-0 bg-transparent border-none'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        className='size-12 stroke-sky-600'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z'
                        />
                    </svg>
                </button>
            </form>

            <div className='flex justify-center items-center col-span-2'>
                <input 
                    className='col-span-2 
                        max-sm:w-[70%] sm:w-[30%] md:w-[40%] 
                        rounded-full bg-sky-400 text-center text-white sm:text-md 
                        md:text-lg lg:text-xl font-quicksand h-12 
                        focus:outline focus:outline-white'
                    type='text'
                    name='search'
                    value={searchMake}
                    placeholder={`Search ${windowWidth >= 768 ? 'for cars by make' : 'by make'}`}
                    onChange={handleSearchChange}
                    // disabled={filterIsClicked.clicked}
                />
            </div>
        </section>
        
    );
}

export default SearchBar;