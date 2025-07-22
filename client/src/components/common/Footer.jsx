const Footer = () => {
    return (
        <footer className='bg-zinc-900 text-gray-300 py-4 px-2 w-full'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <p className='text-sm'>
                    &copy; {new Date().getFullYear()} Mihael Gushterov. All rights reserved.
                </p>
                <a 
                    href='https://github.com/MGushterov' 
                    target='_blank' 
                    rel='noopener noreferrer' 
                    className='text-sm hover:text-white'
                >
                    GitHub Repository
                </a>
            </div>
        </footer>
    );
};

export default Footer;