import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import DataInputPanel from './components/DataInputPanel';
import TransformationPanel from './components/TransformationPanel';
import FloatingActionBar from './components/FloatingActionBar';
import ValidationIndicator from './components/ValidationIndicator';

const DataInputTransformationSetup = () => {
  const navigate = useNavigate();
  
  // State management
  const [inputData, setInputData] = useState('');
  const [inputFormat, setInputFormat] = useState('json');
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationStatus, setValidationStatus] = useState({
    isValid: false,
    errors: [],
    dataLength: 0
  });
  
  const [transformationConfig, setTransformationConfig] = useState({
    mappingRules: [],
    outputFormat: 'xml',
    rootElement: 'root',
    includeXmlDeclaration: true,
    prettyPrint: true,
    includeMetadata: false,
    xsltVersion: '2.0',
    encoding: 'UTF-8',
    errorHandling: true,
    optimizePerformance: false,
    generateComments: true,
    customNamespace: ''
  });

  // Validation function
  const validateInputData = (data) => {
    const errors = [];
    
    if (!data?.trim()) {
      setValidationErrors([]);
      setValidationStatus({
        isValid: false,
        errors: [],
        dataLength: 0
      });
      return;
    }

    try {
      if (inputFormat === 'json' || inputFormat === 'jsonx') {
        JSON.parse(data);
        // Additional JSONX validation - check for @ attributes
        if (inputFormat === 'jsonx') {
          const parsed = JSON.parse(data);
          const hasJsonxAttrs = JSON.stringify(parsed)?.includes('"@');
          if (!hasJsonxAttrs) {
            errors?.push('JSONX format should contain @ attributes for XML compatibility');
          }
        }
      } else if (inputFormat === 'xml') {
        const parser = new DOMParser();
        const xmlDoc = parser?.parseFromString(data, 'text/xml');
        const parseError = xmlDoc?.getElementsByTagName('parsererror');
        if (parseError?.length > 0) {
          errors?.push('Invalid XML structure');
        }
      }
    } catch (error) {
      if (inputFormat === 'json' || inputFormat === 'jsonx') {
        errors?.push(`${inputFormat?.toUpperCase()} Parse Error: ${error?.message}`);
      } else {
        errors?.push(`XML Parse Error: ${error?.message}`);
      }
    }

    setValidationErrors(errors);
    setValidationStatus({
      isValid: errors?.length === 0,
      errors: errors,
      dataLength: data?.length
    });
  };

  // Load sample data with mapping rules
  const loadSampleData = () => {
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

    const sample = sampleData?.[inputFormat];
    setInputData(sample);
    validateInputData(sample);

    // Add sample mapping rules
    const sampleMappingRules = [
      {
        id: Date.now(),
        sourcePath: inputFormat === 'json' ? 'users[*].name' : 
                   inputFormat === 'jsonx' ? 'users[*].name' : 
                   'employees/employee/name',
        targetPath: 'employee/fullName',
        transformation: 'direct',
        condition: ''
      },
      {
        id: Date.now() + 1,
        sourcePath: inputFormat === 'json' ? 'users[*].email' :
                   inputFormat === 'jsonx' ? 'users[*].email' :
                   'employees/employee/email',
        targetPath: 'employee/emailAddress',
        transformation: 'direct',
        condition: ''
      },
      {
        id: Date.now() + 2,
        sourcePath: inputFormat === 'json' ? 'users[*].salary' :
                   inputFormat === 'jsonx' ? 'users[*].salary' :
                   'employees/employee/salary',
        targetPath: 'employee/compensation',
        transformation: 'filter',
        condition: 'salary > 60000'
      }
    ];

    setTransformationConfig(prev => ({
      ...prev,
      mappingRules: sampleMappingRules
    }));
  };

  // Clear all data
  const clearAllData = () => {
    setInputData('');
    setTransformationConfig(prev => ({
      ...prev,
      mappingRules: []
    }));
    setValidationErrors([]);
    setValidationStatus({
      isValid: false,
      errors: [],
      dataLength: 0
    });
  };

  // Generate XSLT and navigate to preview
  const handleGenerateXSLT = () => {
    if (validationStatus?.isValid && transformationConfig?.mappingRules?.length > 0) {
      // Store the configuration in sessionStorage for the next page
      sessionStorage.setItem('transformationData', JSON.stringify({
        inputData,
        inputFormat,
        transformationConfig,
        timestamp: new Date()?.toISOString()
      }));
      
      navigate('/xslt-code-generation-preview');
    }
  };

  // Effect to validate data when format changes
  useEffect(() => {
    if (inputData) {
      validateInputData(inputData);
    }
  }, [inputFormat]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumb />
      <div className="flex-1 p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Data Input & Transformation Setup
              </h2>
              <p className="text-muted-foreground">
                Configure your source data and define transformation rules to generate XSLT code
              </p>
            </div>
            
            {/* Validation Status */}
            <ValidationIndicator
              validationStatus={validationStatus}
              inputFormat={inputFormat}
              dataLength={validationStatus?.dataLength}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative">
          {/* Split Panel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
            {/* Left Panel - Data Input */}
            <div className="bg-card rounded-lg border border-border elevation-1">
              <DataInputPanel
                inputData={inputData}
                setInputData={setInputData}
                inputFormat={inputFormat}
                setInputFormat={setInputFormat}
                validationErrors={validationErrors}
                onValidate={validateInputData}
              />
            </div>

            {/* Right Panel - Transformation Setup */}
            <div className="bg-card rounded-lg border border-border elevation-1">
              <TransformationPanel
                transformationConfig={transformationConfig}
                setTransformationConfig={setTransformationConfig}
                onGenerateXSLT={handleGenerateXSLT}
              />
            </div>
          </div>

          {/* Floating Action Bar - Desktop Only */}
          <div className="hidden lg:block">
            <FloatingActionBar
              validationStatus={validationStatus}
              transformationConfig={transformationConfig}
              onGenerateXSLT={handleGenerateXSLT}
              onLoadSample={loadSampleData}
              onClearAll={clearAllData}
            />
          </div>
        </div>

        {/* Mobile Action Bar */}
        <div className="lg:hidden mt-6 bg-card rounded-lg border border-border p-4">
          <div className="flex flex-col space-y-4">
            {/* Status */}
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`
                  w-3 h-3 rounded-full
                  ${validationStatus?.isValid && validationStatus?.dataLength > 0 ? 'bg-success' : 'bg-muted-foreground'}
                `} />
                <span className="text-xs font-medium text-muted-foreground">
                  Data {validationStatus?.isValid && validationStatus?.dataLength > 0 ? 'Valid' : 'Invalid'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`
                  w-3 h-3 rounded-full
                  ${transformationConfig?.mappingRules?.length > 0 ? 'bg-success' : 'bg-muted-foreground'}
                `} />
                <span className="text-xs font-medium text-muted-foreground">
                  Rules {transformationConfig?.mappingRules?.length > 0 ? 'Defined' : 'Missing'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleGenerateXSLT}
                disabled={!validationStatus?.isValid || !transformationConfig?.mappingRules?.length}
                className={`
                  w-full py-3 px-4 rounded-md font-medium transition-smooth
                  ${validationStatus?.isValid && transformationConfig?.mappingRules?.length > 0
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }
                `}
              >
                Generate XSLT Code
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={loadSampleData}
                  className="flex-1 py-2 px-3 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted/50 transition-smooth"
                >
                  Load Sample
                </button>
                <button
                  onClick={clearAllData}
                  className="flex-1 py-2 px-3 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted/50 transition-smooth"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInputTransformationSetup;