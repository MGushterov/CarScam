import Nav from '../common/Nav';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Footer from '../common/Footer';
import { useEffect, useState } from 'react';
import Documents from './Documents';
import { handleGearboxes, handleTypes } from '../../util/apiCalls';

const CreateAnn = () => {
    const { userId } = useParams();
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm();

    const [types, setTypes] = useState([]);
    const [gearboxes, setGearboxes] = useState([])

    console.log(userId)

    useEffect(() => {
        const handleSetTypes = async () => {
            const data = await handleTypes();

            setTypes(data);
        }

        const handleSetGearboxes = async () => {
            const data = await handleGearboxes();

            setGearboxes(data);
        }

        handleSetTypes();
        handleSetGearboxes();
    }, [])

    const onSubmit = async (formData) => {
        const chosenType = types.find(t => t.id == formData.type)

        if (!chosenType.categories.some(cat => String(cat.id) === String(formData.category))) {
            throw new Error('Vehicle type and category not matching');
        }
        else {
            try {
                formData.price = parseInt(formData.price)
                formData.horsePower = parseInt(formData.horsePower)
                formData.mileage = parseInt(formData.mileage)
                const res = await fetch(`/api/${userId}/announcements/create`, {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify(formData),
                    credentials: 'include'
                });
                if (!res.ok) {
                    throw new Error(`error: ${res.statusText}`)
                }   
                const obj = await res.json();

                confirm('Sucess')
            }
            catch (e) {
                console.error(e.message);
            }
        }
    }

    const allCategories = types && types.reduce((acc, type) => acc.concat(type.categories || []), []);

    return (
        <div className='h-screen flex flex-col items-center'>
            <Nav />
            <form className='glass overflow-y-scroll' onSubmit={handleSubmit(onSubmit)}>
                <input className='form-input' type='text' placeholder='Vehicle make and model' {
                    ...register('vehicleMake', {
                        required: 'Car make and model required',
                        pattern: {
                            value: /^[\p{L}0-9 '&\-.,]+$/u,
                            message: 'Syntax error'
                        }
                    })}
                />

                {errors.vehicleMake && (
                    <div className='text-red-600 font-semibold px-2 text-center'>
                        {errors.vehicleMake.message}
                    </div>
                )}

                <select className='form-input' {
                    ...register('type', {
                        required: 'Select a vehicle type'
                    })
                }>
                    <option value=''>
                        Select a vehicle type
                    </option>
                    {types && types.map(type => (
                        <option value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>

                {errors.type && (
                    <div className='text-red-600 font-semibold px-2 text-center'>
                        {errors.type.message}
                    </div>
                )}

                <select className='form-input' {
                    ...register('category', {
                        required: 'Vehicle category required'
                    })
                }>
                    <option value=''>
                        Select vehicle category
                    </option>
                    {allCategories && allCategories.map(cat => (
                        <option value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {errors.category && (
                    <div className='text-red-600 font-semibold px-2 text-center'>
                        {errors.category.message}
                    </div>
                )}

                <input className='form-input' type='text' placeholder='Vehicle color' {
                    ...register('vehicleColor', {
                        required: 'Car color required',
                        pattern: {
                            value: /^[A-Za-z]+$/,
                            message: 'Syntax error'
                        }
                    })}
                />

                {errors.vehicleColor && (
                    <div className='text-red-600 font-semibold px-2 text-center'>
                        {errors.vehicleColor.message}
                    </div>
                )}

                <input className='form-input' type='text' placeholder='Vehicle engine' {
                    ...register('engine', {
                        required: 'Car engine required',
                        pattern: {
                            value: /^[\p{L}0-9 '&\-.,]+$/u,
                            message: 'Syntax error'
                        }
                    })}
                />

                {errors.engine && (
                    <div className='text-red-600 font-semibold px-2 text-center'>
                        {errors.engine.message}
                    </div>
                )}

                <input className='form-input p-4' type='number' placeholder='Vehicle price' {
                    ...register('price', {
                        required: 'Car price required',
                        pattern: {
                            value: /^[0-9]+$/,
                            message: 'Syntax error'
                        }
                    })}
                />

                {errors.price && (
                    <div className='text-red-600 font-semibold px-2 text-center'>
                        {errors.price.message}
                    </div>
                )}

                <input className='form-input p-4' type='number' placeholder='Vehicle horse power' {
                    ...register('horsePower', {
                        required: 'Car horse power required',
                        pattern: {
                            value: /^[0-9]+$/,
                            message: 'Syntax error'
                        }
                    })}
                />

                {errors.horsePower && (
                    <div className='text-red-600 font-semibold px-2 text-center'>
                        {errors.horsePower.message}
                    </div>
                )}

                <input className='form-input p-4' type='number' placeholder='Vehicle mileage' {
                    ...register('mileage', {
                        required: 'Car mileage required',
                        pattern: {
                            value: /^[0-9]+$/,
                            message: 'Syntax error'
                        }
                    })}
                />

                {errors.mileage && (
                    <div className='text-red-600 font-semibold px-2 text-center'>
                        {errors.mileage.message}
                    </div>
                )}

                <select className='form-input' {
                    ...register('gearbox', {
                        required: 'Vehicle gearbox required'
                    })
                }>
                    <option value=''>
                        Select vehicle gearbox
                    </option>
                    {gearboxes && gearboxes.map(gb => (
                        <option value={gb.name}>
                            {gb.value}
                        </option>
                    ))}
                </select>

                {errors.gearboxes && (
                    <div className='text-red-600 font-semibold px-2 text-center'>
                        {errors.gearboxes.message}
                    </div>
                )}

                <input className='form-input' type='date' {
                    ...register('vehicleYear', {
                    required: 'Vehicle manufacture year required',
                    min: {
                        value: '1900-01-01',
                        message: 'Invalid date'
                    },
                    max: {
                        value: '2025-04-14',
                        message: 'Invalid date'
                    }
                    })}
                />

                {errors.vehicleYear && (
                    <div className='text-red-600 font-semibold px-2 text-center'>{errors.vehicleYear.message}</div>
                )}

                <textarea className='rounded-4xl text-center font-quicksand bg-sky-400 w-[60%] h-64
                    focus:outline focus:outline-black opacity-100'
                    {...register('description')}
                    placeholder='Leave a description here'
                >
                </textarea>

                
                <button className='bg-sky-600 hover:bg-sky-400 rounded-xl h-14 w-[30%]' disabled={isSubmitting}>
                    {isSubmitting ? 'Loading...' : 'Submit'}
                </button>
            </form>
            <Footer />
        </div>
    );
}

export default CreateAnn;