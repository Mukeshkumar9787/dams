import React from 'react'
import countryList from "@/data/countries.json";
import { Button } from 'antd';


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

    const handleRemove = () => {
        if(state?.name && !window.confirm(`Do you want to remove state - ${state?.name} ?`)) return;
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
        <div className="mb-5 flex gap-3">
            <select
                name='name'
                value={state?.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-1 rounded-md border border-gray-3 py-3 pl-5 pr-9 outline-none focus:ring-2 focus:ring-blue/20"
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
                value={state?.amount || ""}
                name="amount"
                min={0}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
            />
            <Button className="bg-red text-white p-5" onClick={handleRemove}>Remove</Button>
        </div>
    )
}

export default State