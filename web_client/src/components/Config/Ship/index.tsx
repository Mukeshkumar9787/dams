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
        <>
            <div className="text-center mt-8">
                <h2 className="font-semibold text-xl sm:text-2xl text-dark">
                    Shipping Info
                </h2>
            </div>

            <div className="mb-5 ">
                <label className="block mb-2.5">Default Amount</label>
                <span className="flex justify-center items-center gap-5">
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={shipInfo?.amount || 0}
                        name="amount"
                        min={0}
                        onChange={(e) => handleChange(e)}
                        required
                        className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                    />
                    <Button className="bg-blue text-white p-5" onClick={handleAddCountry}>Add Country</Button>
                </span>
            </div>
            {(countries.length > 0) && 
                <div className="rounded-md">
                    <span className="text-xl font-bold pb-5">Countries:</span>
                    {countries.map((country, index) => <Country key={country || index} rowIndex={index} country={country} setShipInfo={setShipInfo} />)}
                </div>
            }
        </>
    );
};

export default Ship;
