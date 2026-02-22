import { Button } from 'antd'
import React from 'react'
import Courier from './Courier'

const CourierList = ({ couriers, setCouriers }) => {

    const handleAddCourier = () => {
        setCouriers(prev => [...prev, {name: '', link: ''}])
    }

    return (
        <>
            <div className="text-center mt-8">
                <h2 className="font-semibold text-xl sm:text-2xl text-dark">
                    Courier List
                </h2>
            </div>

            <span className="flex justify-end items-center gap-5">
                <Button className="bg-blue text-white p-5" onClick={handleAddCourier}>Add Courier</Button>
            </span>
            {(couriers.length > 0) &&
                <div className="rounded-md">
                    <span className="text-xl font-bold pb-5">Couriers:</span>
                    {couriers.map((courier, index) => <Courier key={courier || index} rowIndex={index} courier={courier} setCouriers={setCouriers} />)}
                </div>
            }
        </>
    )
}

export default CourierList