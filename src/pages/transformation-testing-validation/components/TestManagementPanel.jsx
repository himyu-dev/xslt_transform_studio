import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TestManagementPanel = ({ onRunTest, onRunAllTests, onSaveTestCase }) => {
  const [activeSection, setActiveSection] = useState('saved');
  const [newTestName, setNewTestName] = useState('');
  const [batchProgress, setBatchProgress] = useState(null);

  const mockTestCases = [
    {
      id: 1,
      name: 'User Transformation Test',
      description: 'Basic user data transformation',
      status: 'passed',
      lastRun: '2025-01-06 14:30:00',
      executionTime: '0.045s'
    },
    {
      id: 2,
      name: 'Product Catalog Test',
      description: 'XML product catalog transformation',
      status: 'passed',
      lastRun: '2025-01-06 14:25:00',
      executionTime: '0.067s'
    },
    {
      id: 3,
      name: 'Empty Dataset Test',
      description: 'Edge case with empty data',
      status: 'failed',
      lastRun: '2025-01-06 14:20:00',
      executionTime: '0.012s'
    },
    {
      id: 4,
      name: 'Large Dataset Test',
      description: 'Performance test with 1000+ records',
      status: 'passed',
      lastRun: '2025-01-06 14:15:00',
      executionTime: '2.345s'
    }
  ];

  const mockValidationRules = [
    {
      id: 1,
      name: 'XML Well-formed',
      description: 'Ensure output XML is well-formed',
      enabled: true,
      type: 'structure'
    },
    {
      id: 2,
      name: 'Required Fields',
      description: 'Check all required fields are present',
      enabled: true,
      type: 'content'
    },
    {
      id: 3,
      name: 'Data Type Validation',
      description: 'Validate data types match schema',
      enabled: false,
      type: 'validation'
    },
    {
      id: 4,
      name: 'Performance Threshold',
      description: 'Execution time under 1 second',
      enabled: true,
      type: 'performance'
    }
  ];

  const sections = [
    { id: 'saved', label: 'Saved Tests', icon: 'Save', count: mockTestCases?.length },
    { id: 'batch', label: 'Batch Testing', icon: 'PlayCircle' },
    { id: 'validation', label: 'Validation Rules', icon: 'Shield', count: mockValidationRules?.filter(r => r?.enabled)?.length }
  ];

  const handleRunSingleTest = (testCase) => {
    onRunTest && onRunTest(testCase);
  };

  const handleRunAllTests = () => {
    setBatchProgress({ current: 0, total: mockTestCases?.length, running: true });
    onRunAllTests && onRunAllTests();
    
    // Simulate batch progress
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setBatchProgress({ current, total: mockTestCases?.length, running: current < mockTestCases?.length });
      if (current >= mockTestCases?.length) {
        clearInterval(interval);
        setTimeout(() => setBatchProgress(null), 2000);
      }
    }, 1000);
  };

  const handleSaveCurrentTest = () => {
    if (newTestName?.trim()) {
      onSaveTestCase && onSaveTestCase(newTestName);
      setNewTestName('');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return { icon: 'CheckCircle', color: 'text-success' };
      case 'failed': return { icon: 'XCircle', color: 'text-error' };
      case 'running': return { icon: 'Clock', color: 'text-warning' };
      default: return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getRuleTypeColor = (type) => {
    switch (type) {
      case 'structure': return 'text-primary';
      case 'content': return 'text-success';
      case 'validation': return 'text-warning';
      case 'performance': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-3">Test Management</h3>
        
        {/* Section Tabs */}
        <div className="flex space-x-1 bg-muted rounded-md p-1">
          {sections?.map((section) => (
            <button
              key={section?.id}
              onClick={() => setActiveSection(section?.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-smooth
                ${activeSection === section?.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name={section?.icon} size={16} />
              <span>{section?.label}</span>
              {section?.count !== undefined && (
                <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {section?.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Saved Tests Section */}
        {activeSection === 'saved' && (
          <div className="space-y-4">
            {/* Save Current Test */}
            <div className="bg-muted rounded-md p-3">
              <h4 className="text-sm font-semibold text-foreground mb-2">Save Current Test</h4>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Test case name"
                  value={newTestName}
                  onChange={(e) => setNewTestName(e?.target?.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveCurrentTest}
                  disabled={!newTestName?.trim()}
                  iconName="Save"
                >
                  Save
                </Button>
              </div>
            </div>

            {/* Test Cases List */}
            <div className="space-y-2">
              {mockTestCases?.map((testCase) => {
                const statusInfo = getStatusIcon(testCase?.status);
                return (
                  <div key={testCase?.id} className="bg-muted rounded-md p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Icon name={statusInfo?.icon} size={16} className={statusInfo?.color} />
                          <h5 className="font-medium text-foreground">{testCase?.name}</h5>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{testCase?.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Last run: {new Date(testCase.lastRun)?.toLocaleString()}</span>
                          <span>Time: {testCase?.executionTime}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRunSingleTest(testCase)}
                        iconName="Play"
                      >
                        Run
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Batch Testing Section */}
        {activeSection === 'batch' && (
          <div className="space-y-4">
            <div className="text-center">
              <Button
                variant="default"
                size="lg"
                onClick={handleRunAllTests}
                disabled={batchProgress?.running}
                iconName={batchProgress?.running ? "Loader2" : "PlayCircle"}
                iconPosition="left"
                className="mb-4"
              >
                {batchProgress?.running ? 'Running Tests...' : 'Run All Tests'}
              </Button>
            </div>

            {/* Batch Progress */}
            {batchProgress && (
              <div className="bg-muted rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Test Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {batchProgress?.current} / {batchProgress?.total}
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(batchProgress?.current / batchProgress?.total) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {batchProgress?.running ? 'Running tests...' : 'Batch testing completed'}
                </div>
              </div>
            )}

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted rounded-md p-3 text-center">
                <div className="text-2xl font-bold text-success">3</div>
                <div className="text-xs text-muted-foreground">Passed</div>
              </div>
              <div className="bg-muted rounded-md p-3 text-center">
                <div className="text-2xl font-bold text-error">1</div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            </div>
          </div>
        )}

        {/* Validation Rules Section */}
        {activeSection === 'validation' && (
          <div className="space-y-3">
            {mockValidationRules?.map((rule) => (
              <div key={rule?.id} className="bg-muted rounded-md p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon 
                        name={rule?.enabled ? "CheckSquare" : "Square"} 
                        size={16} 
                        className={rule?.enabled ? 'text-primary' : 'text-muted-foreground'} 
                      />
                      <h5 className="font-medium text-foreground">{rule?.name}</h5>
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-background ${getRuleTypeColor(rule?.type)}`}>
                        {rule?.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{rule?.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Settings"
                  >
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestManagementPanel;