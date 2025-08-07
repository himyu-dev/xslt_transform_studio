import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TipsPanel = () => {
  const [activeTab, setActiveTab] = useState('tips');

  const tips = [
    {
      id: 1,
      title: "Optimize XSLT Performance",
      content: "Use specific XPath expressions instead of '//' to improve transformation speed. Avoid complex nested loops and consider using keys for lookups.",
      category: "Performance",
      icon: "Zap"
    },
    {
      id: 2,
      title: "Handle Namespaces Properly",
      content: "Always declare namespaces in your XSLT stylesheet. Use namespace prefixes consistently throughout your transformation templates.",
      category: "Best Practice",
      icon: "Tag"
    },
    {
      id: 3,
      title: "Validate Input Data",
      content: "Implement proper error handling for malformed XML/JSON input. Use conditional statements to check for required elements before processing.",
      category: "Error Handling",
      icon: "Shield"
    },
    {
      id: 4,
      title: "Use Template Matching",
      content: "Leverage template matching instead of for-each loops when possible. This makes your XSLT more maintainable and follows best practices.",
      category: "Best Practice",
      icon: "Target"
    }
  ];

  const announcements = [
    {
      id: 1,
      title: "New XSLT 3.0 Support",
      content: "We\'ve added support for XSLT 3.0 features including streaming transformations and improved JSON handling capabilities.",
      date: "2025-08-05",
      type: "feature",
      icon: "Sparkles"
    },
    {
      id: 2,
      title: "Batch Processing Enhancement",
      content: "Process up to 100 files simultaneously with our improved batch transformation engine. Perfect for large-scale data migrations.",
      date: "2025-08-01",
      type: "improvement",
      icon: "Layers"
    },
    {
      id: 3,
      title: "API Integration Templates",
      content: "New pre-built templates for popular APIs including Salesforce, SAP, and REST services. Get started faster with proven patterns.",
      date: "2025-07-28",
      type: "feature",
      icon: "Plug"
    }
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Performance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Best Practice':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Error Handling':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'feature':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'improvement':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Resources & Updates</h2>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('tips')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-smooth ${
              activeTab === 'tips' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Tips
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-smooth ${
              activeTab === 'announcements' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Updates
          </button>
        </div>
      </div>
      {activeTab === 'tips' && (
        <div className="space-y-4">
          {tips?.map((tip) => (
            <div key={tip?.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-smooth">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon name={tip?.icon} size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-foreground">{tip?.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(tip?.category)}`}>
                      {tip?.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tip?.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="text-center pt-4">
            <Button
              variant="ghost"
              iconName="ExternalLink"
              iconPosition="right"
            >
              View All XSLT Best Practices
            </Button>
          </div>
        </div>
      )}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {announcements?.map((announcement) => (
            <div key={announcement?.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-smooth">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Icon name={announcement?.icon} size={16} className="text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-foreground">{announcement?.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(announcement?.type)}`}>
                      {announcement?.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{announcement?.content}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon name="Calendar" size={12} />
                    <span>{formatDate(announcement?.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="text-center pt-4">
            <Button
              variant="ghost"
              iconName="Bell"
              iconPosition="right"
            >
              View All Announcements
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TipsPanel;