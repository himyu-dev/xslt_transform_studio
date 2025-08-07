import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProjectDetailPanel = ({ project, isOpen, onClose, onAction }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !project) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'FileText' },
    { id: 'code', label: 'Generated Code', icon: 'Code' },
    { id: 'tests', label: 'Test Results', icon: 'TestTube' },
    { id: 'files', label: 'Related Files', icon: 'Folder' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Project Summary */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Project Summary</h3>
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Source Format</label>
              <p className="text-foreground">{project?.sourceFormat}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Target Format</label>
              <p className="text-foreground">{project?.targetFormat}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <p className="text-foreground">{project?.description}</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Usage Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{project?.usageCount}</div>
            <div className="text-sm text-muted-foreground">Total Uses</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-success">98%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-warning">2.3s</div>
            <div className="text-sm text-muted-foreground">Avg. Runtime</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-accent">15</div>
            <div className="text-sm text-muted-foreground">Test Cases</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {project?.recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name={activity?.icon} size={16} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-foreground">{activity?.description}</p>
                <p className="text-xs text-muted-foreground">{formatDate(activity?.timestamp)}</p>
              </div>
            </div>
          )) || (
            <p className="text-muted-foreground text-sm">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderCodeTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Generated XSLT Code</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Copy" iconPosition="left">
            Copy Code
          </Button>
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
            Download
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm overflow-x-auto">
        <pre className="text-foreground whitespace-pre-wrap">
{`<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="yes"/>
  
  <xsl:template match="/">
    <root>
      <xsl:for-each select="//item">
        <transformedItem>
          <xsl:attribute name="id">
            <xsl:value-of select="@id"/>
          </xsl:attribute>
          <name>&lt;xsl:value-of select="name"/&gt;</name>
          <value>&lt;xsl:value-of select="value"/&gt;</value>
        </transformedItem>
      </xsl:for-each>
    </root>
  </xsl:template>
</xsl:stylesheet>`}
        </pre>
      </div>
    </div>
  );

  const renderTestsTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Test Results History</h3>
      
      <div className="space-y-3">
        {[
          { id: 1, name: 'Basic Transformation Test', status: 'passed', runtime: '1.2s', date: '2025-01-06T10:30:00Z' },
          { id: 2, name: 'Large Dataset Test', status: 'passed', runtime: '3.4s', date: '2025-01-05T14:20:00Z' },
          { id: 3, name: 'Edge Case Validation', status: 'failed', runtime: '0.8s', date: '2025-01-04T09:15:00Z' },
          { id: 4, name: 'Performance Benchmark', status: 'passed', runtime: '2.1s', date: '2025-01-03T16:45:00Z' }
        ]?.map((test) => (
          <div key={test?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon 
                name={test?.status === 'passed' ? 'CheckCircle' : 'XCircle'} 
                size={20} 
                className={test?.status === 'passed' ? 'text-success' : 'text-error'} 
              />
              <div>
                <p className="font-medium text-foreground">{test?.name}</p>
                <p className="text-sm text-muted-foreground">Runtime: {test?.runtime}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{formatDate(test?.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFilesTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Related Files</h3>
      
      <div className="space-y-3">
        {[
          { name: 'input-sample.json', size: '2.4 KB', type: 'JSON', modified: '2025-01-06T10:30:00Z' },
          { name: 'output-template.xml', size: '1.8 KB', type: 'XML', modified: '2025-01-06T10:25:00Z' },
          { name: 'transformation.xslt', size: '3.2 KB', type: 'XSLT', modified: '2025-01-06T10:20:00Z' },
          { name: 'test-cases.json', size: '5.1 KB', type: 'JSON', modified: '2025-01-05T14:30:00Z' }
        ]?.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="File" size={20} className="text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">{file?.name}</p>
                <p className="text-sm text-muted-foreground">{file?.type} • {file?.size}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">{formatDate(file?.modified)}</p>
              <Button variant="ghost" size="icon">
                <Icon name="Download" size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-2/3 lg:w-1/2 xl:w-2/5 bg-card border-l border-border elevation-3 z-1200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-foreground truncate">{project?.name}</h2>
          <div className="flex items-center space-x-3 mt-2">
            {getStatusBadge(project?.status)}
            <span className="text-sm text-muted-foreground">
              Created {formatDate(project?.createdAt)}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <Icon name="X" size={20} />
        </Button>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-smooth ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'code' && renderCodeTab()}
        {activeTab === 'tests' && renderTestsTab()}
        {activeTab === 'files' && renderFilesTab()}
      </div>
      {/* Actions */}
      <div className="border-t border-border p-6">
        <div className="flex items-center space-x-3">
          <Button
            variant="default"
            onClick={() => onAction('edit', project)}
            iconName="Edit"
            iconPosition="left"
            className="flex-1"
          >
            Edit Project
          </Button>
          <Button
            variant="outline"
            onClick={() => onAction('duplicate', project)}
            iconName="Copy"
            iconPosition="left"
            className="flex-1"
          >
            Duplicate
          </Button>
          <Button
            variant="outline"
            onClick={() => onAction('export', project)}
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPanel;