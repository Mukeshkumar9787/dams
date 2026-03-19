import { Button } from 'antd'
import React from 'react'
import Courier from './Courier'

const CourierList = ({ couriers, setCouriers }) => {

    const handleAddCourier = () => {
        setCouriers(prev => [...prev, {name: '', link: ''}])
    }

    return (
        <div className="mb-8 mt-8 rounded-[26px] bg-white p-5 sm:p-6">
            <div className="pb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                    Courier List
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    Tracking partners
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    Add courier names and tracking links used during order fulfillment.
                </p>
            </div>

            <div className="mt-5 flex justify-end items-center gap-5">
                <Button className="h-12 rounded-2xl bg-blue px-5 text-white" onClick={handleAddCourier}>Add Courier</Button>
            </div>
            {(couriers.length > 0) &&
                <div className="mt-5 pt-5">
                    <span className="mb-4 block text-lg font-semibold text-slate-950">Couriers</span>
                    {couriers.map((courier, index) => <Courier key={courier || index} rowIndex={index} courier={courier} setCouriers={setCouriers} />)}
                </div>
            }
        </div>
    )
}

export default CourierList
