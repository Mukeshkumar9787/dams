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
                        <div className="rounded-[24px] border border-sky-100 bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)] p-5 shadow-[0_14px_35px_rgba(59,130,246,0.08)]">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                                        Courier
                                    </p>
                                    <h3 className="mt-2 text-lg font-semibold text-slate-950">
                                        {additionalInfo?.courier}
                                    </h3>
                                </div>
                                {additionalInfo?.trackingId && (
                                    <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm shadow-sm">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                            Tracking ID
                                        </p>
                                        <p className="mt-1 font-semibold text-slate-900 break-all">
                                            {additionalInfo?.trackingId}
                                        </p>
                                    </div>
                                )}
                                <p className="text-sm text-slate-600">
                                    Track shipment progress with the courier link below.
                                </p>
                            </div>
                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => window.open(link, "_blank", "noopener,noreferrer")}
                                    className="inline-flex items-center justify-center rounded-full border border-slate-900 bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                                >
                                    Track Courier
                                </button>
                                <span className="text-sm text-slate-500">
                                    Shipment handled by {additionalInfo?.courier}
                                </span>
                            </div>
                        </div>
                        }
                </>
            }
        </div>
    )
}

export default CourierDetails
