import { Input } from 'antd'
import React from 'react'

const CourierDetails = ({ couriers, handleChange, additionalInfo, isAdmin, onSubmit }) => {
    const link = couriers.find(courier => courier.name === additionalInfo?.courier)?.link || '#';
    return (
        <div className="font-medium text-dark">
            {isAdmin ?
                <>
                    <h3 className="mb-3 text-base font-semibold text-dark">Courier Details</h3>
                    <select
                        name="courier"
                        value={additionalInfo?.courier || ''}
                        onChange={handleChange}
                        className="form-input w-full bg-white text-dark"
                    >
                        <option value="">Select Courier</option>
                        {couriers.map(courier => (
                            <option key={courier.name} value={courier.name}>{courier.name}</option>
                        ))}
                    </select>
                    <Input className="mt-3" type="text" placeholder="Enter tracking ID" name="trackingId"
                        onChange={handleChange}
                        value={additionalInfo?.trackingId || ''}
                    />
                    <div className='flex items-center justify-end'>
                        <button type='button' onClick={onSubmit} className="btn-primary mt-3 px-5">Save Courier</button>
                    </div>
                </>
                :
                <>
                    {additionalInfo?.courier
                        &&
                        <a href={link} target="_blank" className="inline-flex flex-wrap gap-1 text-blue-600 underline">
                            <span>Courier:</span>&nbsp;{additionalInfo?.courier}
                            {additionalInfo?.trackingId && <span>,&nbsp;Tracking-ID:&nbsp;{additionalInfo?.trackingId || ''}</span>}
                        </a>
                        }
                </>
            }
        </div>
    )
}

export default CourierDetails
