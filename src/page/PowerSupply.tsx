import axios from 'axios';
import { useEffect } from 'react';

const PowerSupply = () => {
    const getData = async () => {
        const result = await axios.get('https://www.msi.com/api/powerCalculator/result?wattage=0');
        console.log(result);
    };
    useEffect(() => {
        getData().then((res) => console.log(res));
    }, []);
    return <div>PowerSupply</div>;
};

export default PowerSupply;
