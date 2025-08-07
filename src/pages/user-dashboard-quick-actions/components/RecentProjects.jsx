import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentProjects = () => {
  const navigate = useNavigate();

  const recentProjects = [
    {
      id: 1,
      name: "Customer Data Migration",
      type: "JSON to XML",
      status: "completed",
      lastModified: "2025-08-06T15:30:00",
      description: "Transform customer records from JSON API to XML format for legacy system integration"
    },
    {
      id: 2,
      name: "Product Catalog Sync",
      type: "XML to JSON",
      status: "in-progress",
      lastModified: "2025-08-06T14:15:00",
      description: "Convert XML product catalog to JSON for modern e-commerce platform"
    },
    {
      id: 3,
      name: "Order Processing Pipeline",
      type: "JSON to XML",
      status: "completed",
      lastModified: "2025-08-06T10:45:00",
      description: "Transform order data for ERP system integration"
    },
    {
      id: 4,
      name: "Inventory Management",
      type: "XML to JSON",
      status: "draft",
      lastModified: "2025-08-05T16:20:00",
      description: "Convert inventory XML feeds to JSON for dashboard visualization"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'in-progress':
        return 'text-warning bg-warning/10';
      case 'draft':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'in-progress':
        return 'Clock';
      case 'draft':
        return 'FileText';
      default:
        return 'FileText';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleProjectAction = (projectId, action) => {
    switch (action) {
      case 'edit': navigate('/data-input-transformation-setup');
        break;
      case 'test': navigate('/transformation-testing-validation');
        break;
      case 'duplicate': navigate('/data-input-transformation-setup');
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Recent Projects</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/transformation-history-management')}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {recentProjects?.map((project) => (
          <div
            key={project?.id}
            className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-smooth"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">{project?.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{project?.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="ArrowRightLeft" size={12} />
                    {project?.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size={12} />
                    {formatDate(project?.lastModified)}
                  </span>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(project?.status)}`}>
                <Icon name={getStatusIcon(project?.status)} size={12} />
                {project?.status?.charAt(0)?.toUpperCase() + project?.status?.slice(1)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleProjectAction(project?.id, 'edit')}
                iconName="Edit"
                iconPosition="left"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleProjectAction(project?.id, 'test')}
                iconName="TestTube"
                iconPosition="left"
              >
                Test
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleProjectAction(project?.id, 'duplicate')}
                iconName="Copy"
                iconPosition="left"
              >
                Duplicate
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;