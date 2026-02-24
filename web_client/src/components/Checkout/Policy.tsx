import { getConfig } from '@/http/apiCalls';
import { CONFIG_KEYS } from '@/utils/constants';
import { Input } from 'antd';
import React from 'react'

type Props = {}

const Policy = (props: Props) => {
    const [compInfo, setCompInfo] = React.useState({});

    const fetchConfig = React.useCallback(async () => {
    try {
        const { success, data } = await getConfig({ configs: [CONFIG_KEYS.COMP_INFO]});

        if (!success) return;

        setCompInfo(data?.[CONFIG_KEYS.COMP_INFO] ?? {});
    } catch (error) {
        console.error(error);
    }
    }, []);
    
    React.useEffect(() => {
    fetchConfig();
    }, [fetchConfig]);
  return (
    <div className='flex bg-white mt-5 p-5 gap-2'>
        <span className=''>
            <Input id='policy' type="checkbox" required name="" size='large' className='text-xl w-full' /> 
        </span>
        <label htmlFor="policy"> 
            <span>Agree&nbsp;to&nbsp;</span>
            <a href={compInfo.privacy} target='_' className='underline text-blue' >Privacy Policy</a>,&nbsp;&nbsp;
            <a href={compInfo.refund} target='_' className='underline text-blue'>Refund Policy</a>&nbsp;and&nbsp;
            <a href={compInfo.terms} target='_' className='underline text-blue'>Terms&nbsp;&&nbsp;conditions</a>
        </label>
    </div>
  )
}

export default Policy;