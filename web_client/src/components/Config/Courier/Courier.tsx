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
        <div className="mb-4 pb-4 last:mb-0 last:pb-0">
            <div className='flex flex-col gap-3 xl:flex-row'>
                <input
                    type="text"
                    placeholder="Enter name"
                    value={courier?.name || ''}
                    name="name"
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 xl:w-[220px] xl:flex-none"
                />
                <input
                    type="text"
                    placeholder="Enter link"
                    value={courier?.link || ''}
                    name="link"
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 xl:min-w-0 xl:flex-1"
                />
                <div className="flex justify-end gap-1 xl:ml-auto">
                    <Button className="h-12 rounded-2xl bg-red px-5 text-white" onClick={handleRemove}>Remove</Button>
                </div>
            </div>
        </div>
    )
}

export default Courier
