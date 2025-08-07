import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';

const GlobalActionButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getContextualAction = () => {
    switch (location.pathname) {
      case '/user-dashboard-quick-actions':
        return {
          label: 'Start New Transformation',
          icon: 'Plus',
          action: () => navigate('/data-input-transformation-setup'),
          variant: 'default'
        };
      case '/data-input-transformation-setup':
        return {
          label: 'Generate XSLT',
          icon: 'Code',
          action: () => navigate('/xslt-code-generation-preview'),
          variant: 'default'
        };
      case '/xslt-code-generation-preview':
        return {
          label: 'Test Code',
          icon: 'TestTube',
          action: () => navigate('/transformation-testing-validation'),
          variant: 'default'
        };
      case '/transformation-testing-validation':
        return {
          label: 'Test Again',
          icon: 'RotateCcw',
          action: () => window.location?.reload(),
          variant: 'outline'
        };
      case '/transformation-history-management':
        return {
          label: 'New Transformation',
          icon: 'Plus',
          action: () => navigate('/data-input-transformation-setup'),
          variant: 'default'
        };
      default:
        return null;
    }
  };

  const contextualAction = getContextualAction();

  if (!contextualAction) {
    return null;
  }

  return (
    <>
      {/* Desktop: Integrated in header - handled by parent component */}
      {/* Mobile: Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-1000 md:hidden">
        <Button
          variant={contextualAction?.variant}
          size="lg"
          onClick={contextualAction?.action}
          iconName={contextualAction?.icon}
          iconPosition="left"
          className="elevation-3 rounded-full px-6 py-3 font-medium"
        >
          {contextualAction?.label}
        </Button>
      </div>
      {/* Desktop: Inline button for header integration */}
      <div className="hidden md:block">
        <Button
          variant={contextualAction?.variant}
          onClick={contextualAction?.action}
          iconName={contextualAction?.icon}
          iconPosition="left"
          className="font-medium"
        >
          {contextualAction?.label}
        </Button>
      </div>
    </>
  );
};

export default GlobalActionButton;