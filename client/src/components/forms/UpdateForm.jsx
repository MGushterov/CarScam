import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';


const UpdateForm = () => {
    const { register, handleSubmit, formState: {errors, isSubmitting} } = useForm();
    const { userId, announcementId } = useParams();

    const onSubmit = async (formData) => {
        try {
            formData.price = parseInt(formData.price)
            formData.mileage = parseInt(formData.mileage)
            const res = await fetch(`/api/${userId}/announcements/${announcementId}/update`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'PUT',
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

    return (
        <div className='min-h-screen w-full flex justify-center p-5 bg-sky-600 relative overflow-hidden'>
            <form className='glass' onSubmit={handleSubmit(onSubmit)}>

                <input className='form-input p-4' type='number' placeholder='Vehicle price' {
                    ...register('price', {
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

                <input className='form-input p-4' type='number' placeholder='Vehicle mileage' {
                    ...register('mileage', {
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
        </div>
    );
}

export default UpdateForm;