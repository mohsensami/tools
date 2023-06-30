import { Link } from 'react-router-dom';
import Weather from '../../components/Weather';
import Calculator from '../../components/Calculator';
import Copy from '../../components/Copy';

const index = () => {
    return (
        <div className="container mx-auto">
            <div className="h-screen flex justify-center items-start mt-16">
                <div className="grid grid-cols-12 gap-12 md:gap-16">
                    <div className="col-span-6 md:col-span-4 border-2 border-gray-400 bg-white flex justify-center items-center  rounded-lg">
                        <Link className="py-16 flex flex-col items-center gap-4" to="/weather">
                            <Weather />
                            <span>وضعیت آب و هوا</span>
                        </Link>
                    </div>
                    <div className="col-span-6 md:col-span-4 border-2 border-gray-400 bg-white flex justify-center items-center rounded-lg">
                        <Link className="py-16 flex flex-col items-center gap-4" to="/calculator">
                            <Calculator />
                            <span>ماشین حساب</span>
                        </Link>
                    </div>
                    <div className="col-span-6 md:col-span-4 border-2 border-gray-400 bg-white flex justify-center items-center rounded-lg">
                        <Link className="py-16 flex flex-col items-center gap-4" to="/lorem">
                            <Copy />
                            <span>لورم ایپسوم</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default index;
