import React from 'react'
import countryList from "@/data/countries.json";
import { Button } from 'antd';
import State from './State';


function Country({ country, setShipInfo, rowIndex }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setShipInfo(prev => {
            const updatedCountries = prev.countries.map((prevCountry, index) => {
                if (index !== rowIndex) return prevCountry;
                return { ...prevCountry, [name] : value }
            })
            return {...prev, countries: updatedCountries};
        })
    }
    const handleRemove = () => {
        if(country?.name && !window.confirm(`Do you want to remove country - ${country?.name}`)) return;
        setShipInfo(prev => {
            const updatedCountries = prev.countries.filter((c, index) => index !== rowIndex);
            return {...prev, countries: updatedCountries};
        })
    }
    const stateList = country?.states || [];
    const handleAddState = () => {
        setShipInfo(prev => {
            const updatedCountries = prev.countries.map((prevCountry, index) => {
                if (index !== rowIndex) return prevCountry;
                const prevStates = (prevCountry?.states || []);
                return { ...prevCountry, states: [...prevStates, { name: '', amount: 0 }] }
            })
            return { ...prev, countries: updatedCountries };
        })
    }
    return (
        <div className="mb-5 bg-white">
            <div className='flex gap-2'>
                <select
                    name='name'
                    onChange={handleChange}
                    required
                    value={country?.name}
                    disabled={country?.states && (country?.states.length > 0)}
                    className="w-full bg-gray-1 rounded-md border border-gray-3 py-3 pl-5 pr-9 outline-none focus:ring-2 focus:ring-blue/20"
                >
                    <option value="">Select Country</option>
                    {countryList.map((country) => (
                        <option key={country.name} value={country.name}>
                            {country.name}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    disabled={!country?.name}
                    placeholder="Enter amount"
                    value={country?.amount || ""}
                    name="amount"
                    min={0}
                    onChange={handleChange}
                    required
                    className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                />
                <div className="flex justify-end">
                    <Button className="bg-red text-white p-5" onClick={handleRemove}>Remove</Button>
                    <Button className="bg-blue text-white p-5" disabled={!country?.name} onClick={handleAddState}>Add State</Button>
                </div>
            </div>
            {stateList.length > 0 &&
                <div className='mt-2 flex flex-col pl-15'>
                    <div className='text-xl py-2 font-bold'>{country?.name} States:</div>
                    <div className=''>
                        {stateList.map((state, index) => <State key={index} country={country} countryIndex={rowIndex} rowIndex={index} state={state} setShipInfo={setShipInfo} />)}
                    </div>
                </div>
            }
        </div>
    )
}

export default Country