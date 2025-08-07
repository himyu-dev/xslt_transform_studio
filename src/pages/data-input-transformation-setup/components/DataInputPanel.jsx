import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DataInputPanel = ({ 
  inputData, 
  setInputData, 
  inputFormat, 
  setInputFormat, 
  validationErrors, 
  onValidate 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const formatOptions = [
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    { value: 'jsonx', label: 'JSONX' }
  ];

  const sampleData = {
    json: `{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "department": "Engineering",
      "salary": 75000,
      "joinDate": "2023-01-15"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "department": "Marketing",
      "salary": 65000,
      "joinDate": "2023-03-20"
    }
  ],
  "metadata": {
    "totalRecords": 2,
    "lastUpdated": "2025-08-06T19:27:47Z"
  }
}`,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<employees>
  <employee id="1">
    <name>John Doe</name>
    <email>john.doe@example.com</email>
    <department>Engineering</department>
    <salary>75000</salary>
    <joinDate>2023-01-15</joinDate>
  </employee>
  <employee id="2">
    <name>Jane Smith</name>
    <email>jane.smith@example.com</email>
    <department>Marketing</department>
    <salary>65000</salary>
    <joinDate>2023-03-20</joinDate>
  </employee>
  <metadata>
    <totalRecords>2</totalRecords>
    <lastUpdated>2025-08-06T19:27:47Z</lastUpdated>
  </metadata>
</employees>`,
    jsonx: `{
  "users": [
    {
      "@id": "1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "department": "Engineering",
      "salary": 75000,
      "joinDate": "2023-01-15"
    },
    {
      "@id": "2", 
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "department": "Marketing",
      "salary": 65000,
      "joinDate": "2023-03-20"
    }
  ],
  "metadata": {
    "@type": "summary",
    "totalRecords": 2,
    "lastUpdated": "2025-08-06T19:27:47Z"
  }
}`
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = e?.dataTransfer?.files;
    if (files?.length > 0) {
      handleFileUpload(files?.[0]);
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e?.target?.result;
      setInputData(content);
      
      // Auto-detect format based on file extension or content
      const extension = file?.name?.split('.')?.pop()?.toLowerCase();
      if (extension === 'json' || extension === 'xml' || extension === 'jsonx') {
        setInputFormat(extension);
      } else {
        // Try to detect from content
        const trimmed = content?.trim();
        if (trimmed?.startsWith('{') || trimmed?.startsWith('[')) {
          // Check for JSONX attributes (@ symbols)
          if (trimmed?.includes('"@')) {
            setInputFormat('jsonx');
          } else {
            setInputFormat('json');
          }
        } else if (trimmed?.startsWith('<?xml') || trimmed?.startsWith('<')) {
          setInputFormat('xml');
        }
      }
      
      onValidate(content);
    };
    reader?.readAsText(file);
  };

  const handleFileSelect = () => {
    fileInputRef?.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const loadSampleData = () => {
    const sample = sampleData?.[inputFormat];
    setInputData(sample);
    onValidate(sample);
  };

  const clearData = () => {
    setInputData('');
    onValidate('');
  };

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setInputData(value);
    onValidate(value);
  };

  const getLineNumbers = () => {
    const lines = inputData?.split('\n');
    return lines?.map((_, index) => index + 1);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="FileInput" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Data Input</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            options={formatOptions}
            value={inputFormat}
            onChange={setInputFormat}
            className="w-28"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={loadSampleData}
            iconName="Database"
            iconPosition="left"
          >
            Sample
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearData}
            iconName="Trash2"
            disabled={!inputData}
          >
            Clear
          </Button>
        </div>
      </div>
      {/* File Upload Dropzone */}
      <div
        className={`
          m-4 p-6 border-2 border-dashed rounded-lg transition-all cursor-pointer
          ${isDragOver 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
      >
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icon 
            name="Upload" 
            size={24} 
            className={isDragOver ? 'text-primary' : 'text-muted-foreground'} 
          />
          <div>
            <p className="text-sm font-medium text-foreground">
              Drop your {inputFormat?.toUpperCase()} file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports .json, .xml, .jsonx files up to 10MB
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.xml,.jsonx"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {/* Code Editor Area */}
      <div className="flex-1 mx-4 mb-4 border border-border rounded-lg overflow-hidden bg-background">
        <div className="flex h-full">
          {/* Line Numbers */}
          <div className="bg-muted/30 px-3 py-4 text-xs font-mono text-muted-foreground border-r border-border min-w-[50px]">
            {getLineNumbers()?.map(num => (
              <div key={num} className="leading-6 text-right">
                {num}
              </div>
            ))}
          </div>
          
          {/* Editor */}
          <div className="flex-1 relative">
            <textarea
              value={inputData}
              onChange={handleInputChange}
              placeholder={`Enter your ${inputFormat?.toUpperCase()} data here...`}
              className="w-full h-full p-4 text-sm font-mono bg-transparent border-none outline-none resize-none leading-6"
              style={{ minHeight: '400px' }}
            />
            
            {/* Validation Errors Overlay */}
            {validationErrors?.length > 0 && (
              <div className="absolute top-2 right-2 bg-error text-error-foreground px-2 py-1 rounded text-xs">
                <Icon name="AlertCircle" size={12} className="inline mr-1" />
                {validationErrors?.length} error{validationErrors?.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Validation Status */}
      {validationErrors?.length > 0 && (
        <div className="mx-4 mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-error mb-1">Validation Errors:</p>
              <ul className="text-xs text-error space-y-1">
                {validationErrors?.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Valid Status */}
      {inputData && validationErrors?.length === 0 && (
        <div className="mx-4 mb-4 p-3 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <p className="text-sm font-medium text-success">
              Valid {inputFormat?.toUpperCase()} format detected
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataInputPanel;