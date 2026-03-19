import React from 'react'
import countryList from "@/data/countries.json";
import { Button } from 'antd';
import State from './State';
import { confirmAction } from '@/utils/notify';


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
    const handleRemove = async () => {
        if(country?.name){
            const isConfirmed = await confirmAction({
                title: "Remove country?",
                content: `Do you want to remove country "${country?.name}"?`,
                okText: "Remove",
            });
            if(!isConfirmed) return;
        }
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
        <div className="mb-5 rounded-[22px] bg-slate-50/80 p-4 last:mb-0">
            <div className='flex flex-col gap-3 xl:flex-row'>
                <select
                    name='name'
                    onChange={handleChange}
                    required
                    value={country?.name}
                    disabled={country?.states && (country?.states.length > 0)}
                    className="form-input w-full bg-white text-slate-950 xl:flex-1"
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
                    value={country?.amount || 0}
                    name="amount"
                    min={0}
                    onChange={handleChange}
                    required
                    className="form-input w-full bg-white text-slate-950 xl:max-w-[220px]"
                />
                <div className="flex justify-end gap-2 xl:ml-auto">
                    <Button className="btn-danger h-auto px-5" onClick={handleRemove}>Remove</Button>
                    <Button className="btn-primary h-auto px-5" disabled={!country?.name} onClick={handleAddState}>Add State</Button>
                </div>
            </div>
            {stateList.length > 0 &&
                <div className='mt-4 rounded-2xl bg-white p-4'>
                    <div className='pb-3 text-base font-semibold text-slate-950'>{country?.name} States</div>
                    <div className=''>
                        {stateList.map((state, index) => <State key={index} country={country} countryIndex={rowIndex} rowIndex={index} state={state} setShipInfo={setShipInfo} />)}
                    </div>
                </div>
            }
        </div>
    )
}

export default Country
