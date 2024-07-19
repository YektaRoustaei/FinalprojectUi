import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const FilterComponent = ({ filters, onFilterChange }) => {
    const [selectedFilters, setSelectedFilters] = useState({});

    const handleFilterChange = (filterKey, option) => {
        const currentFilter = selectedFilters[filterKey] || [];
        const updatedFilter = currentFilter.includes(option)
            ? currentFilter.filter(item => item !== option)
            : [...currentFilter, option];

        const updatedFilters = {
            ...selectedFilters,
            [filterKey]: updatedFilter,
        };

        setSelectedFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    useEffect(() => {
        // Initialize selectedFilters based on filters or other props if needed
    }, [filters]);

    return (
        <div className="p-4 border border-gray-200 rounded-lg w-10/12 m-2">
            {filters.map(({ key, label, options }) => (
                <div key={key} className="mb-4">
                    <h3 className="font-semibold text-lg mb-2 border-b-2">{label}</h3>
                    <div className="space-y-2">
                        {options.map((option) => (
                            <div key={option} className="flex items-center">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-gray-600"
                                        checked={(selectedFilters[key] || []).includes(option)}
                                        onChange={() => handleFilterChange(key, option)}
                                    />
                                    <span className="ml-2 text-gray-700">{option}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

FilterComponent.propTypes = {
    filters: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.string).isRequired,
    })).isRequired,
    onFilterChange: PropTypes.func.isRequired,
};

export default FilterComponent;
