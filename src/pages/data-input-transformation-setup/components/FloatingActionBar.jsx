import React from 'react';

import Button from '../../../components/ui/Button';

const FloatingActionBar = ({ 
  validationStatus, 
  transformationConfig, 
  onGenerateXSLT, 
  onLoadSample, 
  onClearAll 
}) => {
  const hasValidData = validationStatus?.isValid && validationStatus?.dataLength > 0;
  const hasMappingRules = transformationConfig?.mappingRules?.length > 0;
  const canGenerate = hasValidData && hasMappingRules;

  return (
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
      <div className="bg-card border border-border rounded-lg elevation-3 p-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Status Indicators */}
          <div className="flex items-center space-x-4">
            {/* Data Validation Status */}
            <div className="flex items-center space-x-2">
              <div className={`
                w-3 h-3 rounded-full
                ${hasValidData ? 'bg-success' : 'bg-muted-foreground'}
              `} />
              <span className="text-xs font-medium text-muted-foreground">
                Data {hasValidData ? 'Valid' : 'Invalid'}
              </span>
            </div>

            {/* Mapping Rules Status */}
            <div className="flex items-center space-x-2">
              <div className={`
                w-3 h-3 rounded-full
                ${hasMappingRules ? 'bg-success' : 'bg-muted-foreground'}
              `} />
              <span className="text-xs font-medium text-muted-foreground">
                Rules {hasMappingRules ? 'Defined' : 'Missing'}
              </span>
            </div>
          </div>

          {/* Primary Action */}
          <Button
            variant="default"
            size="lg"
            onClick={onGenerateXSLT}
            disabled={!canGenerate}
            iconName="Code"
            iconPosition="left"
            className="font-semibold px-8"
          >
            Generate XSLT
          </Button>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadSample}
              iconName="Database"
              iconPosition="left"
            >
              Load Sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset
            </Button>
          </div>

          {/* Help Text */}
          {!canGenerate && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                {!hasValidData && !hasMappingRules 
                  ? 'Add valid data and define mapping rules'
                  : !hasValidData 
                  ? 'Please provide valid input data' :'Define at least one mapping rule'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingActionBar;