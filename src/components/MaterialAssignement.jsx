import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const MaterialAssignmentForm = () => {
    const [materials, setMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [parentUnit, setParentUnit] = useState('');
    const [childUnit, setChildUnit] = useState('');
    const [signature, setSignature] = useState('');

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/materials/available');
                setMaterials(response.data.map(material => ({
                    value: material.materialId,
                    label: material.name
                })));
            } catch (error) {
                console.error('Error fetching materials', error);
            }
        };

        fetchMaterials();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const assignment = {
            materialId: selectedMaterial?.value,
            parentUnit,
            childUnit,
            signature
        };
        
        try {
            await axios.post('http://localhost:8080/api/discharges', assignment);
            alert('Material assigned successfully!');
        } catch (error) {
            console.error('Error creating assignment', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="material">Select Material:</label>
                <Select
                    id="material"
                    options={materials}
                    onChange={setSelectedMaterial}
                    value={selectedMaterial}
                />
            </div>
            <div>
                <label htmlFor="parentUnit">Parent Unit:</label>
                <input
                    type="text"
                    id="parentUnit"
                    value={parentUnit}
                    onChange={(e) => setParentUnit(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="childUnit">Child Unit:</label>
                <input
                    type="text"
                    id="childUnit"
                    value={childUnit}
                    onChange={(e) => setChildUnit(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="signature">Signature:</label>
                <input
                    type="text"
                    id="signature"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default MaterialAssignmentForm;
