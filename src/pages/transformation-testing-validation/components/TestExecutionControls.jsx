import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TestExecutionControls = ({ onRunTest, onRunAll, onCompareResults, isRunning }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState('current');

  const comparisonOptions = [
    { id: 'current', label: 'Current vs Expected', icon: 'GitCompare' },
    { id: 'previous', label: 'Current vs Previous', icon: 'History' },
    { id: 'baseline', label: 'Current vs Baseline', icon: 'Target' }
  ];

  const handleRunTest = () => {
    onRunTest && onRunTest();
  };

  const handleRunAll = () => {
    onRunAll && onRunAll();
  };

  const handleCompareResults = () => {
    onCompareResults && onCompareResults(selectedComparison);
  };

  return (
    <>
      {/* Desktop: Floating Control Panel */}
      <div className="hidden md:block fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
        <div className={`bg-card border border-border rounded-lg shadow-lg transition-all duration-300 ${isExpanded ? 'p-6 w-80' : 'p-4 w-64'}`}>
          <div className="text-center">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Test Controls</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
              </Button>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-3 mb-4">
              <Button
                variant="default"
                size="lg"
                onClick={handleRunTest}
                disabled={isRunning}
                iconName={isRunning ? "Loader2" : "Play"}
                iconPosition="left"
                fullWidth
                className={isRunning ? "animate-pulse" : ""}
              >
                {isRunning ? 'Running Test...' : 'Run Test'}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleRunAll}
                disabled={isRunning}
                iconName="PlayCircle"
                iconPosition="left"
                fullWidth
              >
                Run All Tests
              </Button>
            </div>

            {/* Expanded Controls */}
            {isExpanded && (
              <div className="space-y-4">
                {/* Comparison Options */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Comparison Type
                  </label>
                  <div className="space-y-2">
                    {comparisonOptions?.map((option) => (
                      <button
                        key={option?.id}
                        onClick={() => setSelectedComparison(option?.id)}
                        className={`
                          flex items-center space-x-2 w-full p-2 rounded-md text-sm transition-smooth
                          ${selectedComparison === option?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                          }
                        `}
                      >
                        <Icon name={option?.icon} size={16} />
                        <span>{option?.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  onClick={handleCompareResults}
                  iconName="GitCompare"
                  iconPosition="left"
                  fullWidth
                >
                  Compare Results
                </Button>
              </div>
            )}

            {/* Status Indicator */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-warning animate-pulse' : 'bg-success'}`}></div>
                <span className="text-xs text-muted-foreground">
                  {isRunning ? 'Test in progress' : 'Ready to test'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile: Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border p-4">
        <div className="flex space-x-2">
          <Button
            variant="default"
            onClick={handleRunTest}
            disabled={isRunning}
            iconName={isRunning ? "Loader2" : "Play"}
            iconPosition="left"
            className="flex-1"
          >
            {isRunning ? 'Running...' : 'Run Test'}
          </Button>
          <Button
            variant="outline"
            onClick={handleRunAll}
            disabled={isRunning}
            iconName="PlayCircle"
          >
            All
          </Button>
          <Button
            variant="secondary"
            onClick={handleCompareResults}
            iconName="GitCompare"
          >
            Compare
          </Button>
        </div>
      </div>
      {/* Mobile: Spacer */}
      <div className="md:hidden h-20"></div>
    </>
  );
};

export default TestExecutionControls;