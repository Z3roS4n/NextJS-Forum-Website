import { LoaderCircle } from 'lucide-react';

const LoadingComponent = () => {
    return (
        <div className='flex flex-col items-center justify-center p-25 opacity-50'>
            <LoaderCircle className='animate-spin' size={48} style={{ animationDuration: '3s'}} />
        </div>
    );
}

export default LoadingComponent;