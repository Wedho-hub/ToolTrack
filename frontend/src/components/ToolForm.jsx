import React, { useState, useEffect } from 'react';

const ToolForm = ({ tool, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Hand Tools',
    quantity: 1,
    location: '',
    condition: 'good',
    imageUrl: ''
  });

  const [error, setError] = useState('');

  // Initialize form data when tool prop changes
  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name || '',
        description: tool.description || '',
        category: tool.category || 'Hand Tools',
        quantity: tool.totalQuantity || 1,
        location: tool.location || '',
        condition: tool.condition || 'good',
        imageUrl: tool.imageUrl || ''
      });
    }
  }, [tool]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await onSubmit(formData);
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving tool');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label htmlFor="name" className="form-label">Tool Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="category" className="form-label">Category</label>
        <select
          className="form-select"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="Hand Tools">Hand Tools</option>
          <option value="Power Tools">Power Tools</option>
          <option value="Measuring Tools">Measuring Tools</option>
          <option value="Safety Equipment">Safety Equipment</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="quantity" className="form-label">Quantity</label>
        <input
          type="number"
          className="form-control"
          id="quantity"
          name="quantity"
          min="1"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="location" className="form-label">Location</label>
        <input
          type="text"
          className="form-control"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="condition" className="form-label">Condition</label>
        <select
          className="form-select"
          id="condition"
          name="condition"
          value={formData.condition}
          onChange={handleChange}
        >
          <option value="new">New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
          <option value="damaged">Damaged</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="imageUrl" className="form-label">Image URL (optional)</label>
        <input
          type="url"
          className="form-control"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        {tool ? 'Update Tool' : 'Add Tool'}
      </button>
    </form>
  );
};

export default ToolForm;
