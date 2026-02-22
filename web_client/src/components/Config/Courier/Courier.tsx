import React from 'react'
import { Button } from 'antd';


function Courier({ setCouriers, rowIndex, courier }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCouriers(prev => {
            const updatedCouriers = prev.map((prevCourier, index) => {
                if (index !== rowIndex) return prevCourier;
                return { ...prevCourier, [name] : value }
            })
            return updatedCouriers
        })
    }
    const handleRemove = () => {
        if(courier?.name && !window.confirm(`Do you want to remove courier - ${courier?.name}`)) return;
        setCouriers(prev => {
            const updatedCouriers = prev.countries.filter((c, index) => index !== rowIndex);
            return updatedCouriers;
        })
    }

    return (
        <div className="mb-5 bg-white">
            <div className='flex gap-2'>
                <input
                    type="text"
                    placeholder="Enter name"
                    value={courier?.name || ''}
                    name="name"
                    onChange={handleChange}
                    required
                    className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                />
                <input
                    type="text"
                    placeholder="Enter link"
                    value={courier?.link || ''}
                    name="link"
                    onChange={handleChange}
                    required
                    className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                />
                <div className="flex justify-end gap-1">
                    <Button className="bg-red text-white p-5" onClick={handleRemove}>Remove</Button>
                </div>
            </div>
        </div>
    )
}

export default Courier