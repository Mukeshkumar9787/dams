import React from "react";
import Country from "./Country";
import { Button } from "antd";

const Ship = ({ shipInfo, setShipInfo }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShipInfo((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const countries = shipInfo?.countries || [];

    const handleAddCountry = () => {
        setShipInfo(prev => {
            const updated = { ...prev };
            if (!updated.countries) {
                updated.countries = [];
            }
            updated.countries = [...updated.countries, { name: '', amount: 0, states: [] }];
            return updated
        })
    }

    return (
        <div className="mb-8 mt-8 rounded-[24px] bg-white/80 p-4 shadow-sm sm:p-5">
            <div className="pb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                    Shipping Info
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    Delivery pricing structure
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    Set a default shipping amount, then override by country and state wherever needed.
                </p>
            </div>

            <div className="mt-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="w-full max-w-[320px]">
                    <label className="form-label">Default Amount</label>
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={shipInfo?.amount || 0}
                        name="amount"
                        min={0}
                        onChange={(e) => handleChange(e)}
                        required
                        className="form-input bg-white text-slate-950 placeholder:text-slate-400"
                    />
                  </div>
                  <Button className="btn-primary h-auto px-5" onClick={handleAddCountry}>Add Country</Button>
                </div>

                {(countries.length > 0) && (
                    <div className="mt-6 pt-5">
                        <span className="mb-4 block text-lg font-semibold text-slate-950">Countries</span>
                        {countries.map((country, index) => <Country key={country || index} rowIndex={index} country={country} setShipInfo={setShipInfo} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ship;
