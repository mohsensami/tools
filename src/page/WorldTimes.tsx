import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

const WorldTimes = () => {
    // const availableTimeZones = () => {
    //     axios('https://timeapi.io/api/timezone/availabletimezones');
    // };
    const getZones = () => {
        axios('https://timeapi.io/api/time/current/zone?timeZone=Asia%2FTehran');
    };
    const zones = useQuery({
        queryKey: ['get-times'],
        queryFn: getZones,
        staleTime: 600000,
    });
    // const zoness = useQuery<any>({
    //     queryKey: ['time-zones-all'],
    //     queryFn: availableTimeZones,
    //     staleTime: 600000,
    // });

    return (
        <div>
            {JSON.stringify(zones.data)}
            {/* <select name="" id="">
                {zones?.data.map((t: any) => (
                    <option>xx</option>
                ))} */}
            {/* </select> */}
        </div>
    );
};

export default WorldTimes;
