import { getOrderStats } from "@/http/apiCalls";
import { ORDER_STATUS, ORDER_STATUS_COLOR } from "@/utils/constants";
import React from "react";

const OrderStats = () => {

    const [statsData, setStatsData] = React.useState({});

    React.useEffect(() => {
        const fetchStats = async () => {
            // Fetch order stats from the server
            try {
                const reponse = await getOrderStats();
                if(reponse.success) {
                    setStatsData(reponse.data || {});
                }
            } catch (error) {

            }
        }
        fetchStats();
    }, []);

    
    const stats = Object.values(ORDER_STATUS).map(i => {
        return {
            label: i,
            value: statsData[i] || 0
        }
    })

    return (
        <div className="flex gap-3 mb-4">
            <div className="bg-white shadow-lg rounded-2xl p-2 w-full">

            {/* Total Orders Center */}
            <div className="text-center mb-4">
                <p className="font-bold text-xl uppercase tracking-wide">
                    Total&nbsp;Orders
                </p>
                <p className="text-6xl font-extrabold text-blue mt-2">
                    {statsData['ALL'] || 0}
                </p>
            </div>

            {/* Status Section */}
            <div className="flex gap-4 justify-between">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="rounded-xl p-4 text-center"
                        >
                        <p className="text-sm">{item.label}</p>
                        <p className="text-2xl font-bold mt-2"
                            style={{ color: ORDER_STATUS_COLOR[item.label]?.color }}
                        >
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>

        </div>
        </div>
    )
}

export default OrderStats;