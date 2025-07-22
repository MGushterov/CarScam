import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';


const SignIn = () => {
    const { register, handleSubmit, formState: {errors, isSubmitting} } = useForm();
    const navigate = useNavigate();
    const onSubmit = async (formData) => {
        try {
            const res = await fetch('/api/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            const data = await res.json();
            console.log(data)

            confirm(data.message);
            navigate('/');
        } catch (error) {
            console.error('There was an error submitting the form: ', error);
            alert('Error submitting form. Please try again.');
        }
    }

    return (
        <div className='min-h-screen w-full flex justify-center p-5 bg-sky-600 relative overflow-hidden'>
            <form className='glass' onSubmit={handleSubmit(onSubmit)}>

                <input className='form-input' type='text' placeholder='Username' {
                    ...register('username', {
                    required: 'Username required', 
                    minLength: {
                        value: 3,
                        message: 'Username length must be greater than 3'
                    }, 
                    maxLength: {
                        value: 16,
                        message: 'Username length must be less than 17'
                    }, 
                    pattern: /[A-Za-z0-9]+/
                    })}
                />

                {errors.username && (
                    <div className='text-red-600 font-semibold px-2 text-center'>{errors.username.message}</div>
                )}

                <input className='form-input' type='password' placeholder='Password' 
                    {...register('password', {
                    required: 'Requirements: one capital letter, one lower case letter, one digit, one special symbol',
                    minLength: {
                        value: 8,
                        message: 'Password length must be greater than 7'
                    },
                    maxLength: {
                        value: 16,
                        message: 'Password length must be less than 17'
                    },
                    pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                        message: 'Invalid password format'
                    },
                    })}
                />

                {errors.password && (
                    <div className='text-red-600 font-semibold px-2 text-center'>{errors.password.message}</div>
                )}
                
                <button className='bg-sky-600 hover:bg-sky-400 rounded-xl h-14 w-[30%]' disabled={isSubmitting}>
                    {isSubmitting ? 'Loading...' : 'Submit'}
                </button>

                <div className='flex justify-around items-center gap-x-8'>
                    <h1 className='text-2xl font-quicksand'>
                        Don't have an account yet? 
                    </h1>
                    <Link className='text-xl text-peach-400 underline font-quicksand hover:text-lg' to='/signup'>
                        <h2>Sign Up Here</h2>
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default SignIn;