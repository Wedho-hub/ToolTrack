import React, { useState } from 'react';

const SearchFilterBar = ({ onSearch, onFilter, categories = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (type, value) => {
    if (type === 'status') {
      setFilterStatus(value);
    } else if (type === 'category') {
      setFilterCategory(value);
    }
    onFilter(type, value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterCategory('all');
    onSearch('');
    onFilter('status', 'all');
    onFilter('category', 'all');
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Search</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={handleClearFilters}
                title="Clear filters"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          <div className="col-md-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="in-use">In Use</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          
          <div className="col-md-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-md-2">
            <label className="form-label">&nbsp;</label>
            <button 
              className="btn btn-outline-primary w-100"
              onClick={handleClearFilters}
            >
              <i className="fas fa-undo mr-1"></i> Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
