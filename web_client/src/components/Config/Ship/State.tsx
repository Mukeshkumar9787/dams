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
        <div className="mb-5 flex gap-3">
            <select
                name='name'
                value={state?.name}
                onChange={handleChange}
                required
                className="form-input"
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
                className="form-input"
            />
            <Button className="bg-red text-white p-5 rounded-md" onClick={handleRemove}>Remove</Button>
        </div>
    )
}

export default State
