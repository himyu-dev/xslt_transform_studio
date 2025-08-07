import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransformationSummary = ({ 
  sourceType, 
  targetFormat, 
  generationTimestamp, 
  onDownload, 
  onCopyToClipboard, 
  onEditTransformation 
}) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Transformation Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-success" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                XSLT Code Generated Successfully
              </h2>
              <p className="text-sm text-muted-foreground">
                Generated on {formatTimestamp(generationTimestamp)}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="FileInput" size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground">Source:</span>
              <span className="font-medium text-foreground bg-muted px-2 py-1 rounded">
                {sourceType}
              </span>
            </div>
            <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
            <div className="flex items-center space-x-2">
              <Icon name="FileOutput" size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground">Target:</span>
              <span className="font-medium text-foreground bg-muted px-2 py-1 rounded">
                {targetFormat}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onEditTransformation}
            iconName="Edit"
            iconPosition="left"
            className="flex-shrink-0"
          >
            Edit
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onCopyToClipboard}
            iconName="Copy"
            iconPosition="left"
            className="flex-shrink-0"
          >
            Copy
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={onDownload}
            iconName="Download"
            iconPosition="left"
            className="flex-shrink-0"
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransformationSummary;