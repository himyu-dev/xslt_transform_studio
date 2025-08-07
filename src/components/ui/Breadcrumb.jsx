import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/user-dashboard-quick-actions': {
      title: 'Dashboard',
      breadcrumbs: [
        { label: 'Home', path: '/user-dashboard-quick-actions' }
      ]
    },
    '/data-input-transformation-setup': {
      title: 'Data Input & Transformation Setup',
      breadcrumbs: [
        { label: 'Home', path: '/user-dashboard-quick-actions' },
        { label: 'Transform', path: '/data-input-transformation-setup' }
      ]
    },
    '/xslt-code-generation-preview': {
      title: 'XSLT Code Generation & Preview',
      breadcrumbs: [
        { label: 'Home', path: '/user-dashboard-quick-actions' },
        { label: 'Transformations', path: '/data-input-transformation-setup' },
        { label: 'Generated Code', path: '/xslt-code-generation-preview' }
      ]
    },
    '/transformation-testing-validation': {
      title: 'Transformation Testing & Validation',
      breadcrumbs: [
        { label: 'Home', path: '/user-dashboard-quick-actions' },
        { label: 'Testing', path: '/transformation-testing-validation' }
      ]
    },
    '/transformation-history-management': {
      title: 'Transformation History & Management',
      breadcrumbs: [
        { label: 'Home', path: '/user-dashboard-quick-actions' },
        { label: 'History', path: '/transformation-history-management' }
      ]
    }
  };

  const currentRoute = routeMap?.[location.pathname];
  
  if (!currentRoute) {
    return null;
  }

  const handleBreadcrumbClick = (path) => {
    if (path !== location.pathname) {
      navigate(path);
    }
  };

  return (
    <div className="bg-background border-b border-border">
      <div className="px-6 py-4">
        <nav className="flex items-center space-x-2 text-sm">
          {currentRoute?.breadcrumbs?.map((crumb, index) => (
            <React.Fragment key={crumb?.path}>
              {index > 0 && (
                <Icon 
                  name="ChevronRight" 
                  size={14} 
                  className="text-muted-foreground" 
                  strokeWidth={2}
                />
              )}
              <button
                onClick={() => handleBreadcrumbClick(crumb?.path)}
                className={`
                  transition-smooth font-medium
                  ${crumb?.path === location.pathname
                    ? 'text-foreground cursor-default'
                    : 'text-muted-foreground hover:text-foreground cursor-pointer'
                  }
                `}
                disabled={crumb?.path === location.pathname}
              >
                {crumb?.label}
              </button>
            </React.Fragment>
          ))}
        </nav>
        
        {/* Page Title - Hidden on mobile breadcrumbs */}
        <h1 className="hidden sm:block text-2xl font-semibold text-foreground mt-2">
          {currentRoute?.title}
        </h1>
        
        {/* Mobile: Show only current page */}
        <div className="sm:hidden">
          <h1 className="text-xl font-semibold text-foreground mt-2">
            {currentRoute?.breadcrumbs?.[currentRoute?.breadcrumbs?.length - 1]?.label}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;