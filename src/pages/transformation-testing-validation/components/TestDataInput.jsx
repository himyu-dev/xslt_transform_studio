import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TestDataInput = ({ onDataChange, onFileUpload }) => {
  const [activeTab, setActiveTab] = useState('sample1');
  const [testData, setTestData] = useState({
    sample1: `{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    },
    {
      "id": 2,
      "name": "Jane Smith", 
      "email": "jane@example.com",
      "role": "user"
    }
  ]
}`,
    sample2: `<?xml version="1.0" encoding="UTF-8"?>
<products>
  <product id="1">
    <name>Laptop</name>
    <price>999.99</price>
    <category>Electronics</category>
  </product>
  <product id="2">
    <name>Mouse</name>
    <price>29.99</price>
    <category>Accessories</category>
  </product>
</products>`,
    custom: ''
  });

  const tabs = [
    { id: 'sample1', label: 'JSON Sample', icon: 'FileJson' },
    { id: 'sample2', label: 'XML Sample', icon: 'FileCode' },
    { id: 'custom', label: 'Custom Data', icon: 'Edit' }
  ];

  const quickSamples = [
    {
      name: 'User List',
      data: `{
  "users": [
    {"id": 1, "name": "Alice", "status": "active"},
    {"id": 2, "name": "Bob", "status": "inactive"}
  ]
}`
    },
    {
      name: 'Product Catalog',
      data: `<?xml version="1.0"?>
<catalog>
  <item code="A001" price="50.00">Widget</item>
  <item code="B002" price="75.00">Gadget</item>
</catalog>`
    },
    {
      name: 'Empty Dataset',
      data: '{"data": []}'
    }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    onDataChange(testData?.[tabId]);
  };

  const handleDataChange = (value) => {
    const updatedData = { ...testData, [activeTab]: value };
    setTestData(updatedData);
    onDataChange(value);
  };

  const handleQuickSample = (sampleData) => {
    const updatedData = { ...testData, [activeTab]: sampleData };
    setTestData(updatedData);
    onDataChange(sampleData);
  };

  const handleFileUpload = (event) => {
    const file = event.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e?.target?.result;
        const updatedData = { ...testData, [activeTab]: content };
        setTestData(updatedData);
        onDataChange(content);
        onFileUpload(file?.name);
      };
      reader?.readAsText(file);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Test Data Input</h3>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept=".json,.xml,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
              iconName="Upload"
              iconPosition="left"
            >
              Upload File
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted rounded-md p-1">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => handleTabChange(tab?.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-smooth
                ${activeTab === tab?.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 flex flex-col">
        {/* Quick Samples */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Quick Samples
          </label>
          <div className="flex flex-wrap gap-2">
            {quickSamples?.map((sample, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSample(sample?.data)}
                className="text-xs"
              >
                {sample?.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Data Input Area */}
        <div className="flex-1">
          <textarea
            value={testData?.[activeTab]}
            onChange={(e) => handleDataChange(e?.target?.value)}
            placeholder={`Enter your ${activeTab === 'sample1' ? 'JSON' : activeTab === 'sample2' ? 'XML' : 'custom'} data here...`}
            className="w-full h-full p-3 border border-border rounded-md bg-background text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Data Stats */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Lines: {testData?.[activeTab]?.split('\n')?.length}</span>
          <span>Characters: {testData?.[activeTab]?.length}</span>
        </div>
      </div>
    </div>
  );
};

export default TestDataInput;