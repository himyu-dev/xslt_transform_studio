import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ExportToolbar = ({ 
  onExport, 
  onShare, 
  onTestWithDifferentData, 
  onSaveToHistory,
  isExporting = false 
}) => {
  const [selectedFormat, setSelectedFormat] = useState('xslt');
  const [showShareOptions, setShowShareOptions] = useState(false);

  const exportFormats = [
    { value: 'xslt', label: 'XSLT File (.xsl)' },
    { value: 'xml', label: 'XML Template (.xml)' },
    { value: 'txt', label: 'Plain Text (.txt)' },
    { value: 'zip', label: 'Complete Package (.zip)' }
  ];

  const shareOptions = [
    { id: 'link', label: 'Copy Share Link', icon: 'Link' },
    { id: 'email', label: 'Share via Email', icon: 'Mail' },
    { id: 'download', label: 'Download & Share', icon: 'Download' }
  ];

  const handleExport = () => {
    onExport(selectedFormat);
  };

  const handleShare = (method) => {
    onShare(method);
    setShowShareOptions(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 elevation-1">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Export Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center space-x-2">
            <Icon name="Download" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Export Options:</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select
              options={exportFormats}
              value={selectedFormat}
              onChange={setSelectedFormat}
              placeholder="Select format"
              className="w-48"
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              loading={isExporting}
              iconName="Download"
              iconPosition="left"
              disabled={!selectedFormat}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Share Button with Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShareOptions(!showShareOptions)}
              iconName="Share2"
              iconPosition="left"
            >
              Share
            </Button>
            
            {showShareOptions && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-lg elevation-2 z-50">
                <div className="py-2">
                  {shareOptions?.map((option) => (
                    <button
                      key={option?.id}
                      onClick={() => handleShare(option?.id)}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                    >
                      <Icon name={option?.icon} size={16} className="text-muted-foreground" />
                      <span>{option?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onSaveToHistory}
            iconName="Save"
            iconPosition="left"
          >
            Save to History
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={onTestWithDifferentData}
            iconName="TestTube"
            iconPosition="left"
          >
            Test with Different Data
          </Button>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground mr-2">Quick Actions:</span>
          
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onExport('xslt')}
            iconName="FileDown"
            iconPosition="left"
            className="text-xs"
          >
            Download XSLT
          </Button>
          
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigator.clipboard?.writeText('Generated XSLT code copied!')}
            iconName="Copy"
            iconPosition="left"
            className="text-xs"
          >
            Copy Code
          </Button>
          
          <Button
            variant="ghost"
            size="xs"
            onClick={() => handleShare('link')}
            iconName="Link"
            iconPosition="left"
            className="text-xs"
          >
            Copy Link
          </Button>
        </div>
      </div>
      {/* Click outside to close share dropdown */}
      {showShareOptions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowShareOptions(false)}
        />
      )}
    </div>
  );
};

export default ExportToolbar;