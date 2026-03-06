import React from 'react'
import { Button } from 'antd';
import { confirmAction } from '@/utils/notify';


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
    const handleRemove = async () => {
        if(courier?.name){
            const isConfirmed = await confirmAction({
                title: "Remove courier?",
                content: `Do you want to remove courier "${courier?.name}"?`,
                okText: "Remove",
            });
            if(!isConfirmed) return;
        }
        setCouriers(prev => {
            const updatedCouriers = prev.filter((c, index) => index !== rowIndex);
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
                    className="form-input"
                />
                <input
                    type="text"
                    placeholder="Enter link"
                    value={courier?.link || ''}
                    name="link"
                    onChange={handleChange}
                    required
                    className="form-input"
                />
                <div className="flex justify-end gap-1">
                    <Button className="bg-red text-white p-5 rounded-md" onClick={handleRemove}>Remove</Button>
                </div>
            </div>
        </div>
    )
}

export default Courier
