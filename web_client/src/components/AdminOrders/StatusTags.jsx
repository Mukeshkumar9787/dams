import React from 'react'
import { ORDER_STATUS, ORDER_STATUS_COLOR } from "../../utils/constants.js"

const StatusTags = ({ status, setStatus }) => {
    return (
        <div className="flex gap-1 text-xs flex-wrap">
            <div className="w-full sm:w-auto flex flex-row items-center gap-2" key={status}>
                <button className={`p-3 rounded-full bg-white`} onClick={() => setStatus('')}
                    style={{ border: status === '' ? '1px solid black' : 'none' }}>
                    <div className="w-20 text-center">All</div>
                </button>
            </div>
            {Object.values(ORDER_STATUS).map((orderStatus) => (
                <div className="w-full sm:w-auto flex flex-row items-center gap-2" key={orderStatus}>
                    <button className={`p-3 rounded-full`} style={{ ...ORDER_STATUS_COLOR[orderStatus], border: (orderStatus === status) ? '1px solid black' : 'none' }} onClick={() => setStatus(orderStatus)}>
                        <div>{orderStatus}</div>
                    </button>
                </div>
            ))}
        </div>
    )
}

export default StatusTags