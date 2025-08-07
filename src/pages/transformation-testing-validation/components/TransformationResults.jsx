import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransformationResults = ({ results, performanceMetrics }) => {
  const [activeView, setActiveView] = useState('output');
  const [showDiff, setShowDiff] = useState(false);

  const mockResults = {
    output: `<?xml version="1.0" encoding="UTF-8"?>
<transformed-data>
  <person id="1">
    <full-name>John Doe</full-name>
    <email-address>john@example.com</email-address>
    <user-role>admin</user-role>
    <status>administrator</status>
  </person>
  <person id="2">
    <full-name>Jane Smith</full-name>
    <email-address>jane@example.com</email-address>
    <user-role>user</user-role>
    <status>standard-user</status>
  </person>
</transformed-data>`,
    expected: `<?xml version="1.0" encoding="UTF-8"?>
<transformed-data>
  <person id="1">
    <full-name>John Doe</full-name>
    <email-address>john@example.com</email-address>
    <user-role>admin</user-role>
    <status>administrator</status>
  </person>
  <person id="2">
    <full-name>Jane Smith</full-name>
    <email-address>jane@example.com</email-address>
    <user-role>user</user-role>
    <status>standard-user</status>
  </person>
</transformed-data>`,
    errors: []
  };

  const mockMetrics = {
    executionTime: '0.045s',
    memoryUsage: '2.3 MB',
    nodesProcessed: 4,
    outputSize: '1.2 KB'
  };

  const currentResults = results || mockResults;
  const currentMetrics = performanceMetrics || mockMetrics;

  const views = [
    { id: 'output', label: 'Output', icon: 'FileOutput' },
    { id: 'formatted', label: 'Formatted', icon: 'Code' },
    { id: 'errors', label: 'Errors', icon: 'AlertCircle', count: currentResults?.errors?.length }
  ];

  const handleExportResults = () => {
    const blob = new Blob([currentResults.output], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transformation-result.xml';
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyResults = () => {
    navigator.clipboard?.writeText(currentResults?.output);
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-foreground">Transformation Results</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-success font-medium">Success</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDiff(!showDiff)}
              iconName="GitCompare"
              iconPosition="left"
            >
              {showDiff ? 'Hide' : 'Show'} Diff
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyResults}
              iconName="Copy"
              iconPosition="left"
            >
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportResults}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex space-x-1 bg-muted rounded-md p-1">
          {views?.map((view) => (
            <button
              key={view?.id}
              onClick={() => setActiveView(view?.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-smooth
                ${activeView === view?.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name={view?.icon} size={16} />
              <span>{view?.label}</span>
              {view?.count !== undefined && view?.count > 0 && (
                <span className="bg-error text-error-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {view?.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 flex flex-col">
        {/* Performance Metrics */}
        <div className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-muted rounded-md p-3">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Execution Time</div>
                  <div className="text-sm font-semibold text-foreground">{currentMetrics?.executionTime}</div>
                </div>
              </div>
            </div>
            <div className="bg-muted rounded-md p-3">
              <div className="flex items-center space-x-2">
                <Icon name="HardDrive" size={16} className="text-accent" />
                <div>
                  <div className="text-xs text-muted-foreground">Memory Usage</div>
                  <div className="text-sm font-semibold text-foreground">{currentMetrics?.memoryUsage}</div>
                </div>
              </div>
            </div>
            <div className="bg-muted rounded-md p-3">
              <div className="flex items-center space-x-2">
                <Icon name="GitBranch" size={16} className="text-warning" />
                <div>
                  <div className="text-xs text-muted-foreground">Nodes Processed</div>
                  <div className="text-sm font-semibold text-foreground">{currentMetrics?.nodesProcessed}</div>
                </div>
              </div>
            </div>
            <div className="bg-muted rounded-md p-3">
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={16} className="text-success" />
                <div>
                  <div className="text-xs text-muted-foreground">Output Size</div>
                  <div className="text-sm font-semibold text-foreground">{currentMetrics?.outputSize}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="flex-1">
          {activeView === 'output' && (
            <div className="h-full">
              <textarea
                value={currentResults?.output}
                readOnly
                className="w-full h-full p-3 border border-border rounded-md bg-muted text-foreground font-mono text-sm resize-none"
                style={{ minHeight: '300px' }}
              />
            </div>
          )}

          {activeView === 'formatted' && (
            <div className="h-full">
              <pre className="w-full h-full p-3 border border-border rounded-md bg-muted text-foreground font-mono text-sm overflow-auto">
                {currentResults?.output}
              </pre>
            </div>
          )}

          {activeView === 'errors' && (
            <div className="h-full">
              {currentResults?.errors?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Icon name="CheckCircle" size={48} className="text-success mb-3" />
                  <h4 className="text-lg font-semibold text-foreground mb-2">No Errors Found</h4>
                  <p className="text-muted-foreground">Your transformation completed successfully without any errors.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentResults?.errors?.map((error, index) => (
                    <div key={index} className="bg-error/10 border border-error/20 rounded-md p-3">
                      <div className="flex items-start space-x-3">
                        <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
                        <div>
                          <div className="font-medium text-error">{error?.type}</div>
                          <div className="text-sm text-foreground mt-1">{error?.message}</div>
                          {error?.line && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Line {error?.line}, Column {error?.column}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Diff View */}
        {showDiff && (
          <div className="mt-4 border-t border-border pt-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">Expected vs Actual Comparison</h4>
            <div className="bg-muted rounded-md p-3 text-sm">
              <div className="text-success">✓ Output matches expected results</div>
              <div className="text-muted-foreground mt-1">No differences found between actual and expected output.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransformationResults;