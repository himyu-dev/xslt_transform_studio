import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProjectFilters from './components/ProjectFilters';
import ProjectGrid from './components/ProjectGrid';
import ProjectToolbar from './components/ProjectToolbar';
import ProjectDetailPanel from './components/ProjectDetailPanel';

const TransformationHistoryManagement = () => {
  const navigate = useNavigate();
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'lastModified', direction: 'desc' });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    collaborator: '',
    dateRange: { start: '', end: '' }
  });

  const itemsPerPage = 10;

  // Mock project data
  const mockProjects = [
    {
      id: 1,
      name: "Customer Data Migration",
      description: "Transform customer records from legacy JSON format to new XML schema",
      sourceFormat: "JSON",
      targetFormat: "XML",
      status: "completed",
      createdAt: "2025-01-01T10:00:00Z",
      lastModified: "2025-01-06T14:30:00Z",
      usageCount: 45,
      collaborator: "john-doe",
      category: "json-to-xml",
      recentActivity: [
        {
          icon: "Play",
          description: "Transformation executed successfully",
          timestamp: "2025-01-06T14:30:00Z"
        },
        {
          icon: "Edit",
          description: "XSLT code updated for better performance",
          timestamp: "2025-01-06T10:15:00Z"
        }
      ]
    },
    {
      id: 2,
      name: "Product Catalog Sync",
      description: "Convert product data between e-commerce platforms",
      sourceFormat: "XML",
      targetFormat: "JSON",
      status: "active",
      createdAt: "2024-12-28T09:15:00Z",
      lastModified: "2025-01-05T16:45:00Z",
      usageCount: 23,
      collaborator: "jane-smith",
      category: "xml-to-json",
      recentActivity: [
        {
          icon: "TestTube",
          description: "Test suite executed with 98% success rate",
          timestamp: "2025-01-05T16:45:00Z"
        }
      ]
    },
    {
      id: 3,
      name: "Financial Report Generator",
      description: "Transform financial data for regulatory compliance reporting",
      sourceFormat: "JSON",
      targetFormat: "XML",
      status: "draft",
      createdAt: "2024-12-25T11:30:00Z",
      lastModified: "2025-01-04T13:20:00Z",
      usageCount: 8,
      collaborator: "mike-johnson",
      category: "custom",
      recentActivity: [
        {
          icon: "Save",
          description: "Draft saved with preliminary transformation rules",
          timestamp: "2025-01-04T13:20:00Z"
        }
      ]
    },
    {
      id: 4,
      name: "Inventory Management System",
      description: "Batch processing for warehouse inventory updates",
      sourceFormat: "CSV",
      targetFormat: "XML",
      status: "active",
      createdAt: "2024-12-20T14:45:00Z",
      lastModified: "2025-01-03T09:10:00Z",
      usageCount: 67,
      collaborator: "sarah-wilson",
      category: "batch",
      recentActivity: [
        {
          icon: "Database",
          description: "Processed 10,000 inventory records successfully",
          timestamp: "2025-01-03T09:10:00Z"
        }
      ]
    },
    {
      id: 5,
      name: "User Profile Migration",
      description: "Migrate user profiles from old system to new platform",
      sourceFormat: "XML",
      targetFormat: "JSON",
      status: "archived",
      createdAt: "2024-12-15T08:20:00Z",
      lastModified: "2024-12-30T17:30:00Z",
      usageCount: 156,
      collaborator: "john-doe",
      category: "xml-to-json",
      recentActivity: [
        {
          icon: "Archive",
          description: "Project archived after successful completion",
          timestamp: "2024-12-30T17:30:00Z"
        }
      ]
    },
    {
      id: 6,
      name: "API Response Transformer",
      description: "Transform API responses for frontend consumption",
      sourceFormat: "JSON",
      targetFormat: "XML",
      status: "completed",
      createdAt: "2024-12-10T12:00:00Z",
      lastModified: "2025-01-02T11:45:00Z",
      usageCount: 89,
      collaborator: "jane-smith",
      category: "json-to-xml",
      recentActivity: [
        {
          icon: "CheckCircle",
          description: "All test cases passed successfully",
          timestamp: "2025-01-02T11:45:00Z"
        }
      ]
    }
  ];

  // Filter and sort projects
  const filteredProjects = mockProjects?.filter(project => {
    const matchesSearch = !filters?.search || 
      project?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      project?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase());
    
    const matchesCategory = !filters?.category || project?.category === filters?.category;
    const matchesStatus = !filters?.status || project?.status === filters?.status;
    const matchesCollaborator = !filters?.collaborator || project?.collaborator === filters?.collaborator;
    
    const matchesDateRange = (!filters?.dateRange?.start || new Date(project.createdAt) >= new Date(filters.dateRange.start)) &&
      (!filters?.dateRange?.end || new Date(project.createdAt) <= new Date(filters.dateRange.end));

    return matchesSearch && matchesCategory && matchesStatus && matchesCollaborator && matchesDateRange;
  });

  const sortedProjects = [...filteredProjects]?.sort((a, b) => {
    const aValue = a?.[sortConfig?.key];
    const bValue = b?.[sortConfig?.key];
    
    if (sortConfig?.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const paginatedProjects = sortedProjects?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setIsDetailPanelOpen(true);
  };

  const handleProjectAction = (action, project) => {
    switch (action) {
      case 'edit': navigate('/data-input-transformation-setup', { state: { editProject: project } });
        break;
      case 'duplicate': console.log('Duplicating project:', project?.name);
        break;
      case 'delete':
        console.log('Deleting project:', project?.name);
        break;
      case 'export':
        console.log('Exporting project:', project?.name);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleBulkAction = (action) => {
    console.log('Bulk action:', action);
  };

  const handleNewTransformation = () => {
    navigate('/data-input-transformation-setup');
  };

  const toggleFilters = () => {
    setIsFiltersCollapsed(!isFiltersCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumb />
      <div className="flex">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden fixed bottom-20 left-4 z-1100">
          <Button
            variant="default"
            size="icon"
            onClick={toggleFilters}
            className="elevation-3 rounded-full"
          >
            <Icon name="Filter" size={20} />
          </Button>
        </div>

        {/* Filters Sidebar */}
        <ProjectFilters
          onFiltersChange={handleFiltersChange}
          isCollapsed={isFiltersCollapsed}
          onToggleCollapse={toggleFilters}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <ProjectToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedCount={0}
            onBulkAction={handleBulkAction}
            onNewTransformation={handleNewTransformation}
            totalProjects={sortedProjects?.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />

          {/* Content Area */}
          <div className="p-6">
            {paginatedProjects?.length > 0 ? (
              <ProjectGrid
                projects={paginatedProjects}
                onProjectSelect={handleProjectSelect}
                onProjectAction={handleProjectAction}
                viewMode={viewMode}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            ) : (
              <div className="text-center py-12">
                <Icon name="FolderOpen" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-6">
                  {filters?.search || filters?.category || filters?.status 
                    ? "Try adjusting your filters to see more results." :"Get started by creating your first transformation project."
                  }
                </p>
                <Button
                  variant="default"
                  onClick={handleNewTransformation}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Create New Transformation
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Project Detail Panel */}
      <ProjectDetailPanel
        project={selectedProject}
        isOpen={isDetailPanelOpen}
        onClose={() => setIsDetailPanelOpen(false)}
        onAction={handleProjectAction}
      />
      {/* Mobile FAB for New Transformation */}
      <div className="lg:hidden fixed bottom-6 right-6 z-1000">
        <Button
          variant="default"
          size="lg"
          onClick={handleNewTransformation}
          iconName="Plus"
          className="elevation-3 rounded-full px-6 py-3 font-medium"
        >
          New Project
        </Button>
      </div>
    </div>
  );
};

export default TransformationHistoryManagement;