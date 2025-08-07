import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ProjectToolbar = ({ 
  viewMode, 
  onViewModeChange, 
  selectedCount, 
  onBulkAction, 
  onNewTransformation,
  totalProjects,
  currentPage,
  itemsPerPage,
  onPageChange
}) => {
  const viewModeOptions = [
    { value: 'grid', label: 'Grid View' },
    { value: 'card', label: 'Card View' },
    { value: 'timeline', label: 'Timeline View' }
  ];

  const bulkActions = [
    { value: 'export', label: 'Export Selected', icon: 'Download' },
    { value: 'duplicate', label: 'Duplicate Selected', icon: 'Copy' },
    { value: 'archive', label: 'Archive Selected', icon: 'Archive' },
    { value: 'delete', label: 'Delete Selected', icon: 'Trash2' }
  ];

  const totalPages = Math.ceil(totalProjects / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalProjects);

  return (
    <div className="bg-card border-b border-border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Bulk Actions */}
        <div className="flex items-center space-x-4">
          {selectedCount > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedCount} selected
              </span>
              <div className="flex items-center space-x-1">
                {bulkActions?.map((action) => (
                  <Button
                    key={action?.value}
                    variant="outline"
                    size="sm"
                    onClick={() => onBulkAction(action?.value)}
                    iconName={action?.icon}
                    iconPosition="left"
                  >
                    {action?.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {selectedCount === 0 && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {totalProjects} projects total
              </span>
            </div>
          )}
        </div>

        {/* Right Section - View Controls & Actions */}
        <div className="flex items-center space-x-4">
          {/* Pagination Info */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Showing {startItem}-{endItem} of {totalProjects}</span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className="w-8 h-8"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              iconName="Grid3X3"
              className="rounded-none border-0"
            />
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('card')}
              iconName="LayoutGrid"
              className="rounded-none border-0"
            />
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('timeline')}
              iconName="Timeline"
              className="rounded-none border-0"
            />
          </div>

          {/* New Transformation Button */}
          <Button
            variant="default"
            onClick={onNewTransformation}
            iconName="Plus"
            iconPosition="left"
            className="hidden lg:flex"
          >
            New Transformation
          </Button>
        </div>
      </div>
      {/* Mobile Actions */}
      <div className="lg:hidden mt-4 flex items-center justify-between">
        <Select
          options={viewModeOptions}
          value={viewMode}
          onChange={onViewModeChange}
          placeholder="View mode"
          className="w-40"
        />
        
        <Button
          variant="default"
          onClick={onNewTransformation}
          iconName="Plus"
          iconPosition="left"
          size="sm"
        >
          New Project
        </Button>
      </div>
    </div>
  );
};

export default ProjectToolbar;