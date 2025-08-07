import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProjectGrid = ({ projects, onProjectSelect, onProjectAction, viewMode, sortConfig, onSort }) => {
  const [selectedProjects, setSelectedProjects] = useState([]);

  const handleSelectProject = (projectId) => {
    setSelectedProjects(prev => 
      prev?.includes(projectId) 
        ? prev?.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProjects?.length === projects?.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects?.map(p => p?.id));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', label: 'Active' },
      completed: { color: 'bg-primary text-primary-foreground', label: 'Completed' },
      draft: { color: 'bg-warning text-warning-foreground', label: 'Draft' },
      archived: { color: 'bg-muted text-muted-foreground', label: 'Archived' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.draft;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  if (viewMode === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <div
            key={project?.id}
            className="bg-card border border-border rounded-lg p-6 hover:elevation-2 transition-smooth cursor-pointer"
            onClick={() => onProjectSelect(project)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{project?.name}</h3>
                <p className="text-sm text-muted-foreground">{project?.description}</p>
              </div>
              {getStatusBadge(project?.status)}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Icon name="ArrowRightLeft" size={14} className="mr-2" />
                {project?.sourceFormat} → {project?.targetFormat}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Icon name="Calendar" size={14} className="mr-2" />
                {formatDate(project?.createdAt)}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Icon name="Activity" size={14} className="mr-2" />
                Used {project?.usageCount} times
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onProjectAction('duplicate', project);
                  }}
                  iconName="Copy"
                  iconPosition="left"
                >
                  Duplicate
                </Button>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onProjectAction('edit', project);
                  }}
                >
                  <Icon name="Edit" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onProjectAction('delete', project);
                  }}
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedProjects?.length === projects?.length && projects?.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              {[
                { key: 'name', label: 'Project Name' },
                { key: 'sourceFormat', label: 'Source → Target' },
                { key: 'status', label: 'Status' },
                { key: 'createdAt', label: 'Created' },
                { key: 'lastModified', label: 'Modified' },
                { key: 'usageCount', label: 'Usage' }
              ]?.map((column) => (
                <th
                  key={column?.key}
                  className="text-left p-4 font-medium text-foreground cursor-pointer hover:bg-muted/70 transition-smooth"
                  onClick={() => onSort(column?.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column?.label}</span>
                    <Icon name={getSortIcon(column?.key)} size={14} />
                  </div>
                </th>
              ))}
              <th className="w-32 p-4 text-center font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects?.map((project) => (
              <tr
                key={project?.id}
                className="border-b border-border hover:bg-muted/30 transition-smooth cursor-pointer"
                onClick={() => onProjectSelect(project)}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedProjects?.includes(project?.id)}
                    onChange={() => handleSelectProject(project?.id)}
                    onClick={(e) => e?.stopPropagation()}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-medium text-foreground">{project?.name}</div>
                    <div className="text-sm text-muted-foreground">{project?.description}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="ArrowRightLeft" size={14} className="text-muted-foreground" />
                    <span className="text-sm">{project?.sourceFormat} → {project?.targetFormat}</span>
                  </div>
                </td>
                <td className="p-4">
                  {getStatusBadge(project?.status)}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {formatDate(project?.createdAt)}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {formatDate(project?.lastModified)}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {project?.usageCount} times
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onProjectAction('duplicate', project);
                      }}
                      title="Duplicate"
                    >
                      <Icon name="Copy" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onProjectAction('edit', project);
                      }}
                      title="Edit"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onProjectAction('export', project);
                      }}
                      title="Export"
                    >
                      <Icon name="Download" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onProjectAction('delete', project);
                      }}
                      title="Delete"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectGrid;