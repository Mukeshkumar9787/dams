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
        <div className="mb-4 rounded-[22px] bg-slate-50/80 p-4 last:mb-0">
            <div className='flex flex-col gap-3 xl:flex-row'>
                <input
                    type="text"
                    placeholder="Enter name"
                    value={courier?.name || ''}
                    name="name"
                    onChange={handleChange}
                    required
                    className="form-input w-full bg-white text-slate-950 placeholder:text-slate-400 xl:w-[220px] xl:flex-none"
                />
                <input
                    type="text"
                    placeholder="Enter link"
                    value={courier?.link || ''}
                    name="link"
                    onChange={handleChange}
                    required
                    className="form-input w-full bg-white text-slate-950 placeholder:text-slate-400 xl:min-w-0 xl:flex-1"
                />
                <div className="flex justify-end gap-1 xl:ml-auto">
                    <Button className="btn-danger h-auto px-5" onClick={handleRemove}>Remove</Button>
                </div>
            </div>
        </div>
    )
}

export default Courier
