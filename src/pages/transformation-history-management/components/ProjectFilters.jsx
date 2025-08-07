import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const ProjectFilters = ({ onFiltersChange, isCollapsed, onToggleCollapse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCollaborator, setSelectedCollaborator] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'json-to-xml', label: 'JSON to XML' },
    { value: 'xml-to-json', label: 'XML to JSON' },
    { value: 'custom', label: 'Custom Transformation' },
    { value: 'batch', label: 'Batch Processing' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' }
  ];

  const collaboratorOptions = [
    { value: '', label: 'All Collaborators' },
    { value: 'john-doe', label: 'John Doe' },
    { value: 'jane-smith', label: 'Jane Smith' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' }
  ];

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchTerm(value);
    onFiltersChange({
      search: value,
      category: selectedCategory,
      status: selectedStatus,
      collaborator: selectedCollaborator,
      dateRange
    });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    onFiltersChange({
      search: searchTerm,
      category: value,
      status: selectedStatus,
      collaborator: selectedCollaborator,
      dateRange
    });
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    onFiltersChange({
      search: searchTerm,
      category: selectedCategory,
      status: value,
      collaborator: selectedCollaborator,
      dateRange
    });
  };

  const handleCollaboratorChange = (value) => {
    setSelectedCollaborator(value);
    onFiltersChange({
      search: searchTerm,
      category: selectedCategory,
      status: selectedStatus,
      collaborator: value,
      dateRange
    });
  };

  const handleDateRangeChange = (field, value) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    onFiltersChange({
      search: searchTerm,
      category: selectedCategory,
      status: selectedStatus,
      collaborator: selectedCollaborator,
      dateRange: newDateRange
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedCollaborator('');
    setDateRange({ start: '', end: '' });
    onFiltersChange({
      search: '',
      category: '',
      status: '',
      collaborator: '',
      dateRange: { start: '', end: '' }
    });
  };

  return (
    <div className={`bg-card border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-0 overflow-hidden' : 'w-80'
    } lg:w-80`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="lg:hidden"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Search */}
          <Input
            type="search"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full"
          />

          {/* Category Filter */}
          <Select
            label="Category"
            options={categoryOptions}
            value={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="Select category"
          />

          {/* Status Filter */}
          <Select
            label="Status"
            options={statusOptions}
            value={selectedStatus}
            onChange={handleStatusChange}
            placeholder="Select status"
          />

          {/* Collaborator Filter */}
          <Select
            label="Collaborator"
            options={collaboratorOptions}
            value={selectedCollaborator}
            onChange={handleCollaboratorChange}
            placeholder="Select collaborator"
          />

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="Start date"
                value={dateRange?.start}
                onChange={(e) => handleDateRangeChange('start', e?.target?.value)}
              />
              <Input
                type="date"
                placeholder="End date"
                value={dateRange?.end}
                onChange={(e) => handleDateRangeChange('end', e?.target?.value)}
              />
            </div>
          </div>

          {/* Clear Filters */}
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="w-full"
            iconName="RotateCcw"
            iconPosition="left"
          >
            Clear All Filters
          </Button>
        </div>
      </div>
      {/* Quick Tags */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-foreground mb-3">Quick Tags</h4>
        <div className="flex flex-wrap gap-2">
          {['Recent', 'Favorites', 'Shared', 'Templates']?.map((tag) => (
            <button
              key={tag}
              className="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full hover:bg-accent hover:text-accent-foreground transition-smooth"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectFilters;