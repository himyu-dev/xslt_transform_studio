import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const TransformationPanel = ({ 
  transformationConfig, 
  setTransformationConfig,
  onGenerateXSLT 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    mapping: true,
    output: true,
    advanced: false
  });

  const outputFormatOptions = [
    { value: 'xml', label: 'XML' },
    { value: 'json', label: 'JSON' },
    { value: 'csv', label: 'CSV' },
    { value: 'jsonx', label: 'JSONX (IBM DataPower)' }
  ];

  const transformationTypeOptions = [
    { value: 'direct', label: 'Direct Mapping' },
    { value: 'aggregate', label: 'Aggregation' },
    { value: 'filter', label: 'Filtering' },
    { value: 'sort', label: 'Sorting' },
    { value: 'group', label: 'Grouping' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const updateConfig = (path, value) => {
    setTransformationConfig(prev => {
      const newConfig = { ...prev };
      const keys = path?.split('.');
      let current = newConfig;
      
      for (let i = 0; i < keys?.length - 1; i++) {
        if (!current?.[keys?.[i]]) current[keys[i]] = {};
        current = current?.[keys?.[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  const addMappingRule = () => {
    const newRule = {
      id: Date.now(),
      sourcePath: '',
      targetPath: '',
      transformation: 'direct',
      condition: ''
    };
    
    updateConfig('mappingRules', [...(transformationConfig?.mappingRules || []), newRule]);
  };

  const removeMappingRule = (ruleId) => {
    const updatedRules = transformationConfig?.mappingRules?.filter(rule => rule?.id !== ruleId) || [];
    updateConfig('mappingRules', updatedRules);
  };

  const updateMappingRule = (ruleId, field, value) => {
    const updatedRules = transformationConfig?.mappingRules?.map(rule => 
      rule?.id === ruleId ? { ...rule, [field]: value } : rule
    ) || [];
    updateConfig('mappingRules', updatedRules);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Settings" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Transformation Setup</h3>
        </div>
        <Button
          variant="default"
          onClick={onGenerateXSLT}
          iconName="Code"
          iconPosition="left"
          disabled={!transformationConfig?.mappingRules?.length}
        >
          Generate XSLT
        </Button>
      </div>
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Field Mapping Section */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection('mapping')}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-smooth"
          >
            <div className="flex items-center space-x-3">
              <Icon name="GitBranch" size={18} className="text-primary" />
              <span className="font-medium text-foreground">Field Mapping Rules</span>
            </div>
            <Icon 
              name={expandedSections?.mapping ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-muted-foreground" 
            />
          </button>
          
          {expandedSections?.mapping && (
            <div className="p-4 pt-0 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Define how source fields map to target structure
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addMappingRule}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Rule
                </Button>
              </div>

              {/* Mapping Rules */}
              <div className="space-y-3">
                {transformationConfig?.mappingRules?.map((rule) => (
                  <div key={rule?.id} className="p-3 border border-border rounded-lg bg-background">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        label="Source Path"
                        placeholder="e.g., users[0].name"
                        value={rule?.sourcePath}
                        onChange={(e) => updateMappingRule(rule?.id, 'sourcePath', e?.target?.value)}
                      />
                      <Input
                        label="Target Path"
                        placeholder="e.g., employee/fullName"
                        value={rule?.targetPath}
                        onChange={(e) => updateMappingRule(rule?.id, 'targetPath', e?.target?.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <Select
                        label="Transformation"
                        options={transformationTypeOptions}
                        value={rule?.transformation}
                        onChange={(value) => updateMappingRule(rule?.id, 'transformation', value)}
                      />
                      <div className="flex items-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMappingRule(rule?.id)}
                          iconName="Trash2"
                          className="text-error hover:text-error"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    {rule?.transformation !== 'direct' && (
                      <div className="mt-3">
                        <Input
                          label="Condition/Parameters"
                          placeholder="e.g., salary > 50000"
                          value={rule?.condition}
                          onChange={(e) => updateMappingRule(rule?.id, 'condition', e?.target?.value)}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {(!transformationConfig?.mappingRules || transformationConfig?.mappingRules?.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="GitBranch" size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No mapping rules defined yet</p>
                    <p className="text-xs">Click "Add Rule" to start mapping your data</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Output Format Section */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection('output')}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-smooth"
          >
            <div className="flex items-center space-x-3">
              <Icon name="FileOutput" size={18} className="text-primary" />
              <span className="font-medium text-foreground">Output Configuration</span>
            </div>
            <Icon 
              name={expandedSections?.output ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-muted-foreground" 
            />
          </button>
          
          {expandedSections?.output && (
            <div className="p-4 pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Output Format"
                  options={outputFormatOptions}
                  value={transformationConfig?.outputFormat || 'xml'}
                  onChange={(value) => updateConfig('outputFormat', value)}
                />
                <Input
                  label="Root Element Name"
                  placeholder="e.g., employees"
                  value={transformationConfig?.rootElement || ''}
                  onChange={(e) => updateConfig('rootElement', e?.target?.value)}
                />
              </div>

              <div className="space-y-3">
                <Checkbox
                  label="Include XML Declaration"
                  checked={transformationConfig?.includeXmlDeclaration || false}
                  onChange={(e) => updateConfig('includeXmlDeclaration', e?.target?.checked)}
                />
                <Checkbox
                  label="Pretty Print Output"
                  checked={transformationConfig?.prettyPrint || true}
                  onChange={(e) => updateConfig('prettyPrint', e?.target?.checked)}
                />
                <Checkbox
                  label="Include Metadata"
                  checked={transformationConfig?.includeMetadata || false}
                  onChange={(e) => updateConfig('includeMetadata', e?.target?.checked)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Advanced Options Section */}
        <div>
          <button
            onClick={() => toggleSection('advanced')}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-smooth"
          >
            <div className="flex items-center space-x-3">
              <Icon name="Wrench" size={18} className="text-primary" />
              <span className="font-medium text-foreground">Advanced Options</span>
            </div>
            <Icon 
              name={expandedSections?.advanced ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-muted-foreground" 
            />
          </button>
          
          {expandedSections?.advanced && (
            <div className="p-4 pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="XSLT Version"
                  value={transformationConfig?.xsltVersion || '2.0'}
                  onChange={(e) => updateConfig('xsltVersion', e?.target?.value)}
                />
                <Input
                  label="Encoding"
                  value={transformationConfig?.encoding || 'UTF-8'}
                  onChange={(e) => updateConfig('encoding', e?.target?.value)}
                />
              </div>

              <div className="space-y-3">
                <Checkbox
                  label="Enable Error Handling"
                  checked={transformationConfig?.errorHandling || true}
                  onChange={(e) => updateConfig('errorHandling', e?.target?.checked)}
                />
                <Checkbox
                  label="Optimize Performance"
                  checked={transformationConfig?.optimizePerformance || false}
                  onChange={(e) => updateConfig('optimizePerformance', e?.target?.checked)}
                />
                <Checkbox
                  label="Generate Comments"
                  checked={transformationConfig?.generateComments || true}
                  onChange={(e) => updateConfig('generateComments', e?.target?.checked)}
                />
              </div>

              <div>
                <Input
                  label="Custom Namespace"
                  placeholder="e.g., http://example.com/transform"
                  value={transformationConfig?.customNamespace || ''}
                  onChange={(e) => updateConfig('customNamespace', e?.target?.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransformationPanel;