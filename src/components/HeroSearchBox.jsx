import PropTypes from 'prop-types';
import SearchBox from './SearchBox';

const HeroSearchBox = ({ onSearchParamsChange }) => {
    return (
        <div className="bg-blue-50 py-16 w-full">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8">
                    Find Your Dream Job Today
                </h1>
                <SearchBox onSearchParamsChange={onSearchParamsChange} />
            </div>
        </div>
    );
};

HeroSearchBox.propTypes = {
    onSearchParamsChange: PropTypes.func.isRequired,
};

export default HeroSearchBox;
