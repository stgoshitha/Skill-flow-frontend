import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BasicLearningPlanForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resources: [''],
    timeLine: '',
    progress: 0
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.timeLine.trim()) {
      newErrors.timeLine = 'Timeline is required';
    }
    
    const validResources = formData.resources.filter(r => r.trim() !== '');
    if (validResources.length === 0) {
      newErrors.resources = 'At least one resource is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Just log the data for testing
    const cleanedFormData = {
      ...formData,
      resources: formData.resources.filter(r => r.trim() !== '')
    };
    
    console.log('Submitting form data:', cleanedFormData);
    alert(`Form submitted successfully with title: ${cleanedFormData.title}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleResourceChange = (index, value) => {
    const updatedResources = [...formData.resources];
    updatedResources[index] = value;
    setFormData({ ...formData, resources: updatedResources });
    
    if (errors.resources) {
      setErrors({ ...errors, resources: '' });
    }
  };

  const addResourceField = () => {
    setFormData({ ...formData, resources: [...formData.resources, ''] });
  };

  const removeResourceField = (index) => {
    const updatedResources = formData.resources.filter((_, i) => i !== index);
    setFormData({ ...formData, resources: updatedResources.length ? updatedResources : [''] });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          ← Back to Home
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create New Learning Plan (Basic Version)
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 border ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 border ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div>
              <label htmlFor="timeLine" className="block text-sm font-medium text-gray-700">
                Timeline*
              </label>
              <input
                type="text"
                id="timeLine"
                name="timeLine"
                value={formData.timeLine}
                onChange={handleChange}
                placeholder="e.g., 4 weeks, 2 months"
                className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 border ${
                  errors.timeLine ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.timeLine && (
                <p className="mt-1 text-sm text-red-600">{errors.timeLine}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resources*
              </label>
              {errors.resources && (
                <p className="mb-2 text-sm text-red-600">{errors.resources}</p>
              )}
              
              {formData.resources.map((resource, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={resource}
                    onChange={(e) => handleResourceChange(index, e.target.value)}
                    placeholder="Enter a resource link or description"
                    className="flex-grow rounded-md shadow-sm py-2 px-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeResourceField(index)}
                    className="ml-2 p-2 text-red-600 hover:text-red-800"
                    disabled={formData.resources.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addResourceField}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Another Resource
              </button>
            </div>

            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
                Progress ({formData.progress}%)
              </label>
              <input
                type="range"
                id="progress"
                name="progress"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleChange}
                className="mt-1 block w-full"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Link
                to="/"
                className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BasicLearningPlanForm;