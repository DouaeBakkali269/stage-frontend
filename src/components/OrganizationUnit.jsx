import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Organization.css';

function OrganizationUnitApp() {
    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);

    useEffect(() => {
        fetchUnits();
    }, []);

    const fetchUnits = async () => {
        const response = await axios.get('http://localhost:8080/api/organization-units');
        setUnits(response.data);
    };

    const handleDelete = async (unitId) => {
        await axios.delete(`http://localhost:8080/api/organization-units/${unitId}`);
        fetchUnits();
    };

    const handleSelectUnit = (unit) => {
        setSelectedUnit(unit);
    };

    return (
        <div className="main-content">
            <h2>Organization Units</h2>
            <OrganizationUnitTable units={units} onDelete={handleDelete} onSelect={handleSelectUnit} />
            <OrganizationUnitForm selectedUnit={selectedUnit} onSave={fetchUnits} />
            <OrganizationUnitTreeView units={units} />
        </div>
    );
}

function OrganizationUnitTable({ units, onDelete, onSelect }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {units.map((unit) => (
                    <tr key={unit.unitId}>
                        <td>{unit.name}</td>
                        <td>{unit.description}</td>
                        <td>{unit.type}</td>
                        <td>
                            <button onClick={() => onSelect(unit)}>Update</button>
                            <button onClick={() => onDelete(unit.unitId)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function OrganizationUnitForm({ selectedUnit, onSave }) {
    const [unit, setUnit] = useState(selectedUnit || {});

    useEffect(() => {
        setUnit(selectedUnit || {});
    }, [selectedUnit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (unit.unitId) {
            await axios.put(`http://localhost:8080/api/organization-units/${unit.unitId}`, unit);
        } else {
            await axios.post('http://localhost:8080/api/organization-units', unit);
        }
        onSave();
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h3>{unit.unitId ? 'Update Organization Unit' : 'Add New Organization Unit'}</h3>
            <input
                type="text"
                value={unit.name || ''}
                onChange={(e) => setUnit({ ...unit, name: e.target.value })}
                placeholder="Name"
                required
            />
            <textarea
                value={unit.description || ''}
                onChange={(e) => setUnit({ ...unit, description: e.target.value })}
                placeholder="Description"
                required
            ></textarea>
            <select
                value={unit.type || ''}
                onChange={(e) => setUnit({ ...unit, type: e.target.value })}
                required
            >
                <option value="">Select Type</option>
                <option value="Type1">Service</option>
                <option value="Type2">Division</option>
                <option value="Type2">District</option>
                <option value="Type2">Annexe</option>
                <option value="Type2">Caidat</option>

            </select>
            <button type="submit">{unit.unitId ? 'Update' : 'Add'}</button>
        </form>
    );
}

function OrganizationUnitTreeView({ units }) {
    const renderTree = (unit) => (
        <li key={unit.unitId}>
            <span>{unit.name}</span>
            {unit.childUnits && (
                <ul>
                    {unit.childUnits.map((child) => renderTree(child))}
                </ul>
            )}
        </li>
    );

    return (
        <div className="tree-view">
            <h3>Organization Structure</h3>
            <ul>{units.map((unit) => !unit.parentUnit && renderTree(unit))}</ul>
        </div>
    );
}

export default OrganizationUnitApp;
