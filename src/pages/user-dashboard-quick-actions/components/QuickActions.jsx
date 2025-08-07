import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'json-to-xml',
      title: 'JSON to XML',
      description: 'Transform JSON data structures to XML format with automated schema mapping',
      icon: 'ArrowRight',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      popular: true
    },
    {
      id: 'xml-to-json',
      title: 'XML to JSON',
      description: 'Convert XML documents to JSON with preserved data hierarchy and types',
      icon: 'ArrowLeft',
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      popular: true
    },
    {
      id: 'load-template',
      title: 'Load Template',
      description: 'Start with pre-built transformation templates for common use cases',
      icon: 'Template',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      popular: false
    },
    {
      id: 'batch-transform',
      title: 'Batch Transform',
      description: 'Process multiple files simultaneously with the same transformation rules',
      icon: 'Layers',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      popular: false
    },
    {
      id: 'custom-xslt',
      title: 'Custom XSLT',
      description: 'Import existing XSLT code and test with your data samples',
      icon: 'Code',
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      popular: false
    },
    {
      id: 'api-integration',
      title: 'API Integration',
      description: 'Connect to external APIs and transform response data in real-time',
      icon: 'Plug',
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      popular: false
    }
  ];

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'json-to-xml': case'xml-to-json': case'load-template': case'batch-transform': case'custom-xslt': case'api-integration': navigate('/data-input-transformation-setup');
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/data-input-transformation-setup')}
          iconName="Settings"
          iconPosition="left"
        >
          Custom Setup
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {quickActions?.map((action) => (
          <div
            key={action?.id}
            className={`relative border rounded-lg p-4 hover:shadow-md transition-smooth cursor-pointer ${action?.borderColor} ${action?.bgColor}`}
            onClick={() => handleQuickAction(action?.id)}
          >
            {action?.popular && (
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                Popular
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${action?.bgColor} border ${action?.borderColor}`}>
                <Icon name={action?.icon} size={20} className={action?.iconColor} />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">{action?.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{action?.description}</p>
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="ArrowRight"
                    iconPosition="right"
                    className="text-xs"
                  >
                    Start Now
                  </Button>
                  
                  {action?.popular && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon name="TrendingUp" size={12} />
                      <span>Trending</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/data-input-transformation-setup')}
            iconName="Plus"
            iconPosition="left"
            fullWidth
          >
            Create Custom Transformation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;