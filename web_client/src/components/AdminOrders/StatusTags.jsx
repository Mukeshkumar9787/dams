import React from 'react'
import { getOrderStats } from '@/http/apiCalls';
import { ORDER_STATUS, ORDER_STATUS_COLOR } from "../../utils/constants.js"

const StatusTags = ({ status, setStatus }) => {
    const [statusStats, setStatusStats] = React.useState({});

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getOrderStats();
                if (response?.success) {
                    setStatusStats(response?.data?.orderStatus || {});
                }
            } catch (error) {}
        };

        fetchStats();
    }, []);

    return (
        <div className="flex gap-1 text-xs flex-wrap">
            <div className="w-full sm:w-auto flex flex-row items-center gap-2" key={status}>
                <button className={`p-3 rounded-full bg-white`} onClick={() => setStatus('')}
                    style={{ border: status === '' ? '1px solid black' : 'none' }}>
                    <div className="min-w-[88px] text-center">All ({Number(statusStats.ALL || 0)})</div>
                </button>
            </div>
            {Object.values(ORDER_STATUS).map((orderStatus) => (
                <div className="w-full sm:w-auto flex flex-row items-center gap-2" key={orderStatus}>
                    <button className={`p-3 rounded-full`} style={{ ...ORDER_STATUS_COLOR[orderStatus], border: (orderStatus === status) ? '1px solid black' : 'none' }} onClick={() => setStatus(orderStatus)}>
                        <div>{orderStatus} ({Number(statusStats[orderStatus] || 0)})</div>
                    </button>
                </div>
            ))}
        </div>
    )
}

export default StatusTags
