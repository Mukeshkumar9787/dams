import React from 'react'
import countryList from "@/data/countries.json";
import { Button } from 'antd';
import { confirmAction } from '@/utils/notify';


function State({ country, state, setShipInfo, countryIndex, rowIndex }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setShipInfo(prev => {
            const updatedCountries = prev.countries.map((prevCountry, i) => {
                if(countryIndex !== i) return prevCountry;
                const updatedStates = (prevCountry?.states || []).map((prevState, i) => {
                    if(i !== rowIndex) return prevState;
                    return {...prevState, [name] : value};
                });
                return { ...prevCountry, states: updatedStates }
            })
            return { ...prev, countries: updatedCountries };
        })
    }

    const handleRemove = async () => {
        if(state?.name){
            const isConfirmed = await confirmAction({
                title: "Remove state?",
                content: `Do you want to remove state "${state?.name}"?`,
                okText: "Remove",
            });
            if(!isConfirmed) return;
        }
        setShipInfo(prev => {
            const updatedCountries = prev.countries.map((prevCountry) => {
                const prevStates = (prevCountry?.states || []);
                return { ...prevCountry, states: prevStates.filter((s,index) => index !== rowIndex) }
            })
            return { ...prev, countries: updatedCountries };
        })
    }
    const stateList = countryList.find(i => i.name === country.name)?.states || [];
    return (
        <div className="mb-3 flex flex-col gap-3 rounded-2xl bg-white p-3 md:flex-row">
            <select
                name='name'
                value={state?.name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-sky-500"
            >
                <option value="">Select State</option>
                {stateList.map((state) => (
                    <option key={state.name} value={state.name}>
                        {state.name}
                    </option>
                ))}
            </select>
            <input
                type="number"
                placeholder="Enter amount"
                value={state?.amount || 0}
                name="amount"
                min={0}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-sky-500 md:max-w-[220px]"
            />
            <Button className="h-12 rounded-2xl bg-red px-5 text-white md:ml-auto" onClick={handleRemove}>Remove</Button>
        </div>
    )
}

export default State
