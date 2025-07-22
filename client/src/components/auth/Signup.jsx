import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const { register, handleSubmit, formState: {errors, isSubmitting} } = useForm({
        defaultValues: {
            firstName: '',
            surname: '',
            username: '',
            email: '',
            password: ''
        }
    });
    const navigate = useNavigate();
    
    const onSubmit = async (formData) => {
        console.log(formData)
        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            confirm(data.message);
            navigate('/signin');
        } catch (error) {
            console.error('There was an error submitting the form: ', error);
            alert('Error submitting form. Please try again.');
        }
    }

    return (
        <div className='min-h-screen w-full flex justify-center p-5 bg-sky-600 relative overflow-hidden'>
            <form className='glass' onSubmit={handleSubmit(onSubmit)}>

                <input className='form-input' type='text' placeholder='First Name' {
                    ...register('firstName', {
                    required: 'Name required',
                    maxLength: {
                        value: 16,
                        message: 'Name length must be less than 17'
                    }, 
                    pattern: /[A-Za-z]+/
                    })}
                />

                {errors.firstName && (
                    <div className='text-red-600 font-semibold px-2 text-center'>{errors.firstName.message}</div>
                )}

                <input className='form-input' type='text' placeholder='Surname' {
                    ...register('surname', {
                    required: 'Name required',
                    maxLength: {
                        value: 16,
                        message: 'Name length must be less than 17'
                    }, 
                    pattern: /[A-Za-z]+/
                    })}
                />

                {errors.surname && (
                    <div className='text-red-600 font-semibold px-2 text-center'>{errors.surname.message}</div>
                )}

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

                <input className='form-input' type='text' placeholder='Email' {
                    ...register('email', { 
                    required: 'Email required',
                    maxLength: {
                        value: 64,
                        message: 'Email length must be less than 65'
                    }, 
                    pattern: {
                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'Invalid email format'
                    }
                    })}
                />

                {errors.email && (
                    <div className='text-red-600 font-semibold px-2 text-center'>{errors.email.message}</div>
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
            </form>
        </div>
    );
}

export default SignUp;