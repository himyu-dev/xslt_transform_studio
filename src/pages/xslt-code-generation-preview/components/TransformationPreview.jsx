import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransformationPreview = ({ inputData, outputData, isLoading = false }) => {
  const [activeTab, setActiveTab] = useState('before');
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  const tabs = [
    { id: 'before', label: 'Input Data', icon: 'FileInput' },
    { id: 'after', label: 'Output Data', icon: 'FileOutput' }
  ];

  const toggleNode = (path) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded?.has(path)) {
      newExpanded?.delete(path);
    } else {
      newExpanded?.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  const renderJsonTree = (data, path = '', level = 0) => {
    if (typeof data !== 'object' || data === null) {
      return (
        <span className="text-primary font-mono text-sm">
          {JSON.stringify(data)}
        </span>
      );
    }

    const isArray = Array.isArray(data);
    const entries = isArray ? data?.map((item, index) => [index, item]) : Object.entries(data);
    const isExpanded = expandedNodes?.has(path);

    return (
      <div className={level > 0 ? 'ml-4' : ''}>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleNode(path)}
            iconName={isExpanded ? "ChevronDown" : "ChevronRight"}
            className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
          />
          <span className="text-muted-foreground font-mono text-sm">
            {isArray ? '[' : '{'}
          </span>
          {!isExpanded && (
            <span className="text-muted-foreground text-xs">
              {entries?.length} {isArray ? 'items' : 'properties'}
            </span>
          )}
        </div>
        {isExpanded && (
          <div className="ml-2">
            {entries?.map(([key, value], index) => (
              <div key={key} className="flex items-start space-x-2 py-1">
                <span className="text-accent font-mono text-sm font-medium">
                  {isArray ? `[${key}]` : `"${key}"`}:
                </span>
                <div className="flex-1">
                  {renderJsonTree(value, `${path}.${key}`, level + 1)}
                </div>
              </div>
            ))}
          </div>
        )}
        {isExpanded && (
          <span className="text-muted-foreground font-mono text-sm ml-4">
            {isArray ? ']' : '}'}
          </span>
        )}
      </div>
    );
  };

  const renderXmlTree = (xmlString) => {
    // Simple XML formatting for display
    const formatted = xmlString?.replace(/></g, '>\n<')?.split('\n')?.map((line, index) => (
        <div key={index} className="font-mono text-sm text-foreground leading-6">
          {line}
        </div>
      ));
    
    return <div className="space-y-1">{formatted}</div>;
  };

  const getCurrentData = () => {
    return activeTab === 'before' ? inputData : outputData;
  };

  const isXmlData = (data) => {
    return typeof data === 'string' && data?.trim()?.startsWith('<');
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden elevation-1 h-full flex flex-col">
      {/* Preview Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <Icon name="Eye" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Transformation Preview
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedNodes(new Set())}
              iconName="Minimize"
              className="h-8 w-8 p-0"
              title="Collapse All"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const allPaths = new Set();
                const addPaths = (obj, path = '') => {
                  if (typeof obj === 'object' && obj !== null) {
                    allPaths?.add(path);
                    Object.keys(obj)?.forEach(key => {
                      addPaths(obj?.[key], `${path}.${key}`);
                    });
                  }
                };
                addPaths(getCurrentData());
                setExpandedNodes(allPaths);
              }}
              iconName="Maximize"
              className="h-8 w-8 p-0"
              title="Expand All"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-smooth
                ${activeTab === tab?.id
                  ? 'bg-background text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon name={tab?.icon} size={14} strokeWidth={2} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Preview Content */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-3 text-muted-foreground">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Processing transformation...</span>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {getCurrentData() ? (
              isXmlData(getCurrentData()) ? (
                renderXmlTree(getCurrentData())
              ) : (
                renderJsonTree(getCurrentData())
              )
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <Icon name="FileX" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No data available</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Preview Footer */}
      <div className="border-t border-border px-4 py-2 bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>
              Format: {isXmlData(getCurrentData()) ? 'XML' : 'JSON'}
            </span>
            {getCurrentData() && (
              <span>
                Size: {JSON.stringify(getCurrentData())?.length} chars
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={12} className="text-success" />
            <span className="text-success">Valid Format</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransformationPreview;