import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import TransformationSummary from './components/TransformationSummary';
import CodeEditor from './components/CodeEditor';
import TransformationPreview from './components/TransformationPreview';
import ExportToolbar from './components/ExportToolbar';

const XSLTCodeGenerationPreview = () => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [xsltCode, setXsltCode] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [transformationData, setTransformationData] = useState(null);

  // Generate XML to JSON XSLT code
  const generateXmlToJsonXslt = (inputData, config) => {
    return `<?xml version="1.0" encoding="${config?.encoding || 'UTF-8'}"?>
<xsl:stylesheet version="${config?.xsltVersion || '2.0'}" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:fn="http://www.w3.org/2005/xpath-functions">
  
  <xsl:output method="text" encoding="${config?.encoding || 'UTF-8'}" ${config?.prettyPrint ? 'indent="yes"' : ''}/>
  
  <!-- Root template for XML to JSON conversion -->
  <xsl:template match="/">
    <xsl:text>{</xsl:text>
    <xsl:apply-templates select="*"/>
    <xsl:text>}</xsl:text>
  </xsl:template>
  
  <!-- Template for elements with children -->
  <xsl:template match="*[*]">
    &lt;xsl:text&gt;"&lt;/xsl:text&gt;<xsl:value-of select="local-name()"/><xsl:text>": {</xsl:text>
    <xsl:for-each select="*">
      <xsl:apply-templates select="."/>
      <xsl:if test="position() != last()">
        &lt;xsl:text&gt;,&lt;/xsl:text&gt;
      </xsl:if>
    </xsl:for-each>
    <xsl:text>}</xsl:text>
    <xsl:if test="position() != last()">
      &lt;xsl:text&gt;,&lt;/xsl:text&gt;
    </xsl:if>
  </xsl:template>
  
  <!-- Template for leaf elements -->
  <xsl:template match="*[not(*)]">
    &lt;xsl:text&gt;"&lt;/xsl:text&gt;<xsl:value-of select="local-name()"/>&lt;xsl:text&gt;": "&lt;/xsl:text&gt;
    <xsl:value-of select="normalize-space(.)"/>
    &lt;xsl:text&gt;"&lt;/xsl:text&gt;
    <xsl:if test="position() != last()">
      &lt;xsl:text&gt;,&lt;/xsl:text&gt;
    </xsl:if>
  </xsl:template>
  
  <!-- Template for attributes -->
  <xsl:template match="@*">
    &lt;xsl:text&gt;"@&lt;/xsl:text&gt;<xsl:value-of select="local-name()"/>&lt;xsl:text&gt;": "&lt;/xsl:text&gt;
    <xsl:value-of select="."/>
    &lt;xsl:text&gt;"&lt;/xsl:text&gt;
    <xsl:if test="position() != last() or ../node()[not(self::text()[normalize-space()=''])]">
      &lt;xsl:text&gt;,&lt;/xsl:text&gt;
    </xsl:if>
  </xsl:template>
  
  <!-- Handle arrays (multiple elements with same name) -->
  <xsl:template match="*[count(../*[local-name() = local-name(current())]) > 1]">
    <xsl:if test="position() = 1">
      &lt;xsl:text&gt;"&lt;/xsl:text&gt;<xsl:value-of select="local-name()"/><xsl:text>": [</xsl:text>
    </xsl:if>
    
    <xsl:text>{</xsl:text>
    <xsl:apply-templates select="@*"/>
    <xsl:apply-templates select="node()[not(self::text()[normalize-space()=''])]"/>
    <xsl:text>}</xsl:text>
    
    <xsl:if test="position() != last()">
      &lt;xsl:text&gt;,&lt;/xsl:text&gt;
    </xsl:if>
    
    <xsl:if test="position() = last()">
      <xsl:text>]</xsl:text>
      <xsl:if test="following-sibling::*[local-name() != local-name(current())]">
        &lt;xsl:text&gt;,&lt;/xsl:text&gt;
      </xsl:if>
    </xsl:if>
  </xsl:template>
  
</xsl:stylesheet>`;
  };

  // Generate JSON to XML XSLT code
  const generateJsonToXmlXslt = (inputData, config) => {
    return `<?xml version="1.0" encoding="${config?.encoding || 'UTF-8'}"?>
<xsl:stylesheet version="${config?.xsltVersion || '2.0'}" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" ${config?.prettyPrint ? 'indent="yes"' : ''} encoding="${config?.encoding || 'UTF-8'}"/>
  
  <!-- Root template for JSON to XML conversion -->
  <xsl:template match="/">
    <${config?.rootElement || 'root'}>
      ${config?.includeXmlDeclaration && config?.includeMetadata ? `
      <xsl:if test="//metadata">
        <xsl:apply-templates select="//metadata"/>
      </xsl:if>` : ''}
      <xsl:apply-templates select="*"/>
    </${config?.rootElement || 'root'}>
  </xsl:template>
  
  <!-- Template for objects -->
  <xsl:template match="*[*]">
    <xsl:element name="{local-name()}">
      <xsl:apply-templates select="*"/>
    </xsl:element>
  </xsl:template>
  
  <!-- Template for arrays -->
  <xsl:template match="*[count(*) > 1 and *[1][local-name() = local-name(*[2])]]">
    <xsl:for-each select="*">
      <xsl:element name="{local-name()}">
        <xsl:if test="@* | *">
          <xsl:apply-templates select="@* | *"/>
        </xsl:if>
        <xsl:if test="not(@* | *)">
          <xsl:value-of select="."/>
        </xsl:if>
      </xsl:element>
    </xsl:for-each>
  </xsl:template>
  
  <!-- Template for simple values -->
  <xsl:template match="*[not(*) and not(@*)]">
    <xsl:element name="{local-name()}">
      <xsl:value-of select="."/>
    </xsl:element>
  </xsl:template>
  
  <!-- Template for elements with attributes -->
  <xsl:template match="*[@*]">
    <xsl:element name="{local-name()}">
      <xsl:for-each select="@*">
        <xsl:attribute name="{local-name()}">
          <xsl:value-of select="."/>
        </xsl:attribute>
      </xsl:for-each>
      <xsl:apply-templates select="node()"/>
    </xsl:element>
  </xsl:template>
  
  <!-- Metadata handling -->
  <xsl:template match="metadata">
    <metadata>
      <xsl:apply-templates select="*"/>
      <generatedBy>XSLT Transformation</generatedBy>
      <timestamp>&lt;xsl:value-of select="current-dateTime()"/&gt;</timestamp>
    </metadata>
  </xsl:template>
  
</xsl:stylesheet>`;
  };

  // Generate JSON to JSONX XSLT code
  const generateJsonToJsonxXslt = (inputData, config) => {
    return `<?xml version="1.0" encoding="${config?.encoding || 'UTF-8'}"?>
<xsl:stylesheet version="${config?.xsltVersion || '2.0'}" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:jsonx="http://www.ibm.com/xmlns/prod/2009/jsonx">
  
  <xsl:output method="xml" ${config?.prettyPrint ? 'indent="yes"' : ''} encoding="${config?.encoding || 'UTF-8'}"/>
  
  <!-- Root template for JSON to JSONX conversion -->
  <xsl:template match="/">
    <jsonx:object xmlns:jsonx="http://www.ibm.com/xmlns/prod/2009/jsonx">
      <xsl:apply-templates select="*"/>
    </jsonx:object>
  </xsl:template>
  
  <!-- Template for JSON objects -->
  <xsl:template match="*[*]">
    <jsonx:object name="{local-name()}">
      <xsl:apply-templates select="*"/>
    </jsonx:object>
  </xsl:template>
  
  <!-- Template for JSON arrays -->
  <xsl:template match="*[count(../*[local-name() = local-name(current())]) > 1]">
    <xsl:if test="position() = 1">
      <jsonx:array name="{local-name()}">
    </xsl:if>
    
    <jsonx:object>
      <xsl:apply-templates select="*"/>
    </jsonx:object>
    
    <xsl:if test="position() = last()">
      </jsonx:array>
    </xsl:if>
  </xsl:template>
  
  <!-- Template for simple string values -->
  <xsl:template match="*[not(*) and not(number(.) = number(.) and string(number(.)) = string(.))]">
    <jsonx:string name="{local-name()}">
      <xsl:value-of select="."/>
    </jsonx:string>
  </xsl:template>
  
  <!-- Template for numeric values -->
  <xsl:template match="*[not(*) and number(.) = number(.) and string(number(.)) = string(.)]">
    <jsonx:number name="{local-name()}">
      <xsl:value-of select="."/>
    </jsonx:number>
  </xsl:template>
  
  <!-- Template for boolean values -->
  <xsl:template match="*[not(*) and (. = 'true' or . = 'false')]">
    <jsonx:boolean name="{local-name()}">
      <xsl:value-of select="."/>
    </jsonx:boolean>
  </xsl:template>
  
  <!-- Template for null values -->
  <xsl:template match="*[not(*) and . = '']">
    <jsonx:null name="{local-name()}"/>
  </xsl:template>
  
</xsl:stylesheet>`;
  };

  // Generate XML to JSONX XSLT code
  const generateXmlToJsonxXslt = (inputData, config) => {
    return `<?xml version="1.0" encoding="${config?.encoding || 'UTF-8'}"?>
<xsl:stylesheet version="${config?.xsltVersion || '2.0'}" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:jsonx="http://www.ibm.com/xmlns/prod/2009/jsonx">
  
  <xsl:output method="xml" ${config?.prettyPrint ? 'indent="yes"' : ''} encoding="${config?.encoding || 'UTF-8'}"/>
  
  <!-- Root template for XML to JSONX conversion -->
  <xsl:template match="/">
    <jsonx:object xmlns:jsonx="http://www.ibm.com/xmlns/prod/2009/jsonx">
      <xsl:apply-templates select="*"/>
    </jsonx:object>
  </xsl:template>
  
  <!-- Template for elements with children -->
  <xsl:template match="*[*]">
    <jsonx:object name="{local-name()}">
      <!-- Process attributes as properties -->
      <xsl:for-each select="@*">
        <jsonx:string name="@{local-name()}">
          <xsl:value-of select="."/>
        </jsonx:string>
      </xsl:for-each>
      <xsl:apply-templates select="*"/>
    </jsonx:object>
  </xsl:template>
  
  <!-- Template for elements that appear multiple times (arrays) -->
  <xsl:template match="*[count(../*[local-name() = local-name(current())]) > 1]">
    <xsl:if test="position() = 1">
      <jsonx:array name="{local-name()}">
    </xsl:if>
    
    <jsonx:object>
      <xsl:for-each select="@*">
        <jsonx:string name="@{local-name()}">
          <xsl:value-of select="."/>
        </jsonx:string>
      </xsl:for-each>
      <xsl:apply-templates select="node()[not(self::text()[normalize-space()=''])]"/>
    </jsonx:object>
    
    <xsl:if test="position() = last()">
      </jsonx:array>
    </xsl:if>
  </xsl:template>
  
  <!-- Template for leaf elements with text content -->
  <xsl:template match="*[not(*) and normalize-space()]">
    <xsl:choose>
      <xsl:when test="number(.) = number(.) and string(number(.)) = string(.)">
        <jsonx:number name="{local-name()}">
          <xsl:value-of select="."/>
        </jsonx:number>
      </xsl:when>
      <xsl:when test=". = 'true' or . = 'false'">
        <jsonx:boolean name="{local-name()}">
          <xsl:value-of select="."/>
        </jsonx:boolean>
      </xsl:when>
      <xsl:otherwise>
        <jsonx:string name="{local-name()}">
          <xsl:value-of select="."/>
        </jsonx:string>
      </xsl:otherwise>
    </xsl:choose>
    
    <!-- Process attributes -->
    <xsl:for-each select="@*">
      <jsonx:string name="@{local-name()}">
        <xsl:value-of select="."/>
      </jsonx:string>
    </xsl:for-each>
  </xsl:template>
  
  <!-- Template for empty elements -->
  <xsl:template match="*[not(*) and not(normalize-space())]">
    <jsonx:null name="{local-name()}"/>
    <xsl:for-each select="@*">
      <jsonx:string name="@{local-name()}">
        <xsl:value-of select="."/>
      </jsonx:string>
    </xsl:for-each>
  </xsl:template>
  
</xsl:stylesheet>`;
  };

  // Generate mock output data based on transformation direction
  const generateMockOutput = (inputData, inputFormat, targetFormat) => {
    if (inputFormat === 'json' && targetFormat === 'xml') {
      // Convert JSON structure to XML representation
      try {
        const parsed = JSON.parse(inputData);
        if (parsed?.users) {
          return `<?xml version="1.0" encoding="UTF-8"?>
<root>
  ${parsed?.users?.map(user => `
  <user id="${user?.id}">
    <name>${user?.name}</name>
    <email>${user?.email}</email>
    ${user?.department ? `<department>${user?.department}</department>` : ''}
    ${user?.salary ? `<salary>${user?.salary}</salary>` : ''}
    ${user?.joinDate ? `<joinDate>${user?.joinDate}</joinDate>` : ''}
  </user>`)?.join('')}
  ${parsed?.metadata ? `
  <metadata>
    <totalRecords>${parsed?.metadata?.totalRecords}</totalRecords>
    <lastUpdated>${parsed?.metadata?.lastUpdated}</lastUpdated>
  </metadata>` : ''}
</root>`;
        }
      } catch (e) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <message>Generated XML output will appear here</message>
</root>`;
      }
    } else if (inputFormat === 'xml' && targetFormat === 'json') {
      // Convert XML structure to JSON representation
      return `{
  "employees": [
    {
      "@id": "1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "department": "Engineering",
      "salary": "75000",
      "joinDate": "2023-01-15"
    },
    {
      "@id": "2", 
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "department": "Marketing",
      "salary": "65000",
      "joinDate": "2023-03-20"
    }
  ],
  "metadata": {
    "totalRecords": "2",
    "lastUpdated": "2025-08-06T19:27:47Z"
  }
}`;
    } else if (inputFormat === 'json' && targetFormat === 'jsonx') {
      // Convert JSON structure to JSONX representation
      return `<?xml version="1.0" encoding="UTF-8"?>
<jsonx:object xmlns:jsonx="http://www.ibm.com/xmlns/prod/2009/jsonx">
  <jsonx:array name="users">
    <jsonx:object>
      &lt;jsonx:number name="id"&gt;1&lt;/jsonx:number&gt;
      &lt;jsonx:string name="name"&gt;John Doe&lt;/jsonx:string&gt;
      &lt;jsonx:string name="email"&gt;john.doe@example.com&lt;/jsonx:string&gt;
      &lt;jsonx:string name="department"&gt;Engineering&lt;/jsonx:string&gt;
      &lt;jsonx:number name="salary"&gt;75000&lt;/jsonx:number&gt;
      &lt;jsonx:string name="joinDate"&gt;2023-01-15&lt;/jsonx:string&gt;
    </jsonx:object>
    <jsonx:object>
      &lt;jsonx:number name="id"&gt;2&lt;/jsonx:number&gt;
      &lt;jsonx:string name="name"&gt;Jane Smith&lt;/jsonx:string&gt;
      &lt;jsonx:string name="email"&gt;jane.smith@example.com&lt;/jsonx:string&gt;
      &lt;jsonx:string name="department"&gt;Marketing&lt;/jsonx:string&gt;
      &lt;jsonx:number name="salary"&gt;65000&lt;/jsonx:number&gt;
      &lt;jsonx:string name="joinDate"&gt;2023-03-20&lt;/jsonx:string&gt;
    </jsonx:object>
  </jsonx:array>
  <jsonx:object name="metadata">
    &lt;jsonx:number name="totalRecords"&gt;2&lt;/jsonx:number&gt;
    &lt;jsonx:string name="lastUpdated"&gt;2025-08-06T19:27:47Z&lt;/jsonx:string&gt;
  </jsonx:object>
</jsonx:object>`;
    } else if (inputFormat === 'xml' && targetFormat === 'jsonx') {
      // Convert XML structure to JSONX representation
      return `<?xml version="1.0" encoding="UTF-8"?>
<jsonx:object xmlns:jsonx="http://www.ibm.com/xmlns/prod/2009/jsonx">
  <jsonx:array name="employee">
    <jsonx:object>
      &lt;jsonx:string name="@id"&gt;1&lt;/jsonx:string&gt;
      &lt;jsonx:string name="name"&gt;John Doe&lt;/jsonx:string&gt;
      &lt;jsonx:string name="email"&gt;john.doe@example.com&lt;/jsonx:string&gt;
      &lt;jsonx:string name="department"&gt;Engineering&lt;/jsonx:string&gt;
      &lt;jsonx:string name="salary"&gt;75000&lt;/jsonx:string&gt;
      &lt;jsonx:string name="joinDate"&gt;2023-01-15&lt;/jsonx:string&gt;
    </jsonx:object>
    <jsonx:object>
      &lt;jsonx:string name="@id"&gt;2&lt;/jsonx:string&gt;
      &lt;jsonx:string name="name"&gt;Jane Smith&lt;/jsonx:string&gt;
      &lt;jsonx:string name="email"&gt;jane.smith@example.com&lt;/jsonx:string&gt;
      &lt;jsonx:string name="department"&gt;Marketing&lt;/jsonx:string&gt;
      &lt;jsonx:string name="salary"&gt;65000&lt;/jsonx:string&gt;
      &lt;jsonx:string name="joinDate"&gt;2023-03-20&lt;/jsonx:string&gt;
    </jsonx:object>
  </jsonx:array>
  <jsonx:object name="metadata">
    &lt;jsonx:string name="totalRecords"&gt;2&lt;/jsonx:string&gt;
    &lt;jsonx:string name="lastUpdated"&gt;2025-08-06T19:27:47Z&lt;/jsonx:string&gt;
  </jsonx:object>
</jsonx:object>`;
    }
    return '';
  };

  // Load transformation data and generate XSLT
  useEffect(() => {
    // Try to load from sessionStorage
    const storedData = sessionStorage.getItem('transformationData');
    
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setTransformationData(parsed);
        
        // Generate appropriate XSLT code based on transformation direction
        let generatedXslt = '';
        const targetFormat = parsed?.transformationConfig?.outputFormat || 'xml';
        
        if (parsed?.inputFormat === 'json' && targetFormat === 'xml') {
          generatedXslt = generateJsonToXmlXslt(parsed?.inputData, parsed?.transformationConfig);
        } else if (parsed?.inputFormat === 'xml' && targetFormat === 'json') {
          generatedXslt = generateXmlToJsonXslt(parsed?.inputData, parsed?.transformationConfig);
        } else if (parsed?.inputFormat === 'json' && targetFormat === 'jsonx') {
          generatedXslt = generateJsonToJsonxXslt(parsed?.inputData, parsed?.transformationConfig);
        } else if (parsed?.inputFormat === 'xml' && targetFormat === 'jsonx') {
          generatedXslt = generateXmlToJsonxXslt(parsed?.inputData, parsed?.transformationConfig);
        } else {
          // Default fallback
          generatedXslt = generateJsonToXmlXslt(parsed?.inputData, parsed?.transformationConfig);
        }
        
        setXsltCode(generatedXslt);
      } catch (error) {
        console.error('Error parsing transformation data:', error);
        // Fallback to default mock data
        setTransformationData(getDefaultMockData());
        setXsltCode(generateJsonToXmlXslt('', {}));
      }
    } else {
      // Fallback to default mock data
      setTransformationData(getDefaultMockData());
      setXsltCode(generateJsonToXmlXslt('', {}));
    }
  }, []);

  // Default mock data for when no sessionStorage data exists
  const getDefaultMockData = () => {
    const mockData = {
      inputFormat: 'json',
      transformationConfig: {
        outputFormat: 'xml',
        rootElement: 'root',
        encoding: 'UTF-8',
        xsltVersion: '2.0',
        prettyPrint: true,
        includeXmlDeclaration: true,
        includeMetadata: false
      },
      inputData: `{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "profile": {
        "age": 30,
        "department": "Engineering",
        "skills": ["JavaScript", "React", "Node.js"]
      }
    }
  ],
  "metadata": {
    "total": 1,
    "generated": "2025-08-06T19:42:04.938Z"
  }
}`,
      timestamp: new Date()?.toISOString()
    };
    
    mockData.outputData = generateMockOutput(
      mockData?.inputData, 
      mockData?.inputFormat, 
      mockData?.transformationConfig?.outputFormat
    );
    
    return mockData;
  };

  const handleDownload = () => {
    const blob = new Blob([xsltCode], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transformation.xsl';
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard?.writeText(xsltCode);
      // You could add a toast notification here
      console.log('Code copied to clipboard');
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleEditTransformation = () => {
    navigate('/data-input-transformation-setup');
  };

  const handleCodeChange = (newCode) => {
    setXsltCode(newCode);
    
    // Simple validation - check for basic XSLT structure
    const errors = [];
    if (!newCode?.includes('<?xml')) {
      errors?.push({ line: 1, message: 'Missing XML declaration' });
    }
    if (!newCode?.includes('xsl:stylesheet')) {
      errors?.push({ line: 2, message: 'Missing XSLT stylesheet declaration' });
    }
    
    setValidationErrors(errors);
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      let filename, mimeType, content;
      
      switch (format) {
        case 'xslt':
          filename = 'transformation.xsl';
          mimeType = 'application/xml';
          content = xsltCode;
          break;
        case 'xml':
          filename = 'template.xml';
          mimeType = 'application/xml';
          content = transformationData?.outputData;
          break;
        case 'txt':
          filename = 'transformation.txt';
          mimeType = 'text/plain';
          content = xsltCode;
          break;
        case 'zip':
          filename = 'transformation-package.zip';
          mimeType = 'application/zip';
          content = xsltCode; // In real app, this would be a zip file
          break;
        default:
          content = xsltCode;
          filename = 'transformation.xsl';
          mimeType = 'application/xml';
      }
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body?.appendChild(a);
      a?.click();
      document.body?.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
    }, 1500);
  };

  const handleShare = (method) => {
    switch (method) {
      case 'link':
        const shareUrl = `${window.location?.origin}/xslt-code-generation-preview?shared=true`;
        navigator.clipboard?.writeText(shareUrl);
        console.log('Share link copied to clipboard');
        break;
      case 'email':
        const emailSubject = 'XSLT Transformation Code';
        const emailBody = `Check out this XSLT transformation code:\n\n${xsltCode}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        break;
      case 'download':
        handleDownload();
        break;
      default:
        console.log('Share method not implemented:', method);
    }
  };

  const handleTestWithDifferentData = () => {
    navigate('/transformation-testing-validation');
  };

  const handleSaveToHistory = () => {
    // In a real app, this would save to backend/localStorage
    console.log('Transformation saved to history');
    navigate('/transformation-history-management');
  };

  // Ensure transformationData exists before rendering
  if (!transformationData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading transformation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumb />
      <main className="px-6 py-6 space-y-6">
        {/* Transformation Summary - 20% height */}
        <div className="h-auto">
          <TransformationSummary
            sourceType={transformationData?.inputFormat?.toUpperCase()}
            targetFormat={transformationData?.transformationConfig?.outputFormat?.toUpperCase()}
            generationTimestamp={new Date(transformationData?.timestamp)}
            onDownload={handleDownload}
            onCopyToClipboard={handleCopyToClipboard}
            onEditTransformation={handleEditTransformation}
          />
        </div>

        {/* Main Content Area - Three Panel Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 min-h-[600px]">
          {/* Code Editor - 60% width on desktop */}
          <div className="xl:col-span-3 order-1 xl:order-1">
            <CodeEditor
              xsltCode={xsltCode}
              onCodeChange={handleCodeChange}
              validationErrors={validationErrors}
            />
          </div>

          {/* Transformation Preview - 40% width on desktop */}
          <div className="xl:col-span-2 order-2 xl:order-2">
            <TransformationPreview
              inputData={transformationData?.inputData}
              outputData={transformationData?.outputData || generateMockOutput(
                transformationData?.inputData,
                transformationData?.inputFormat,
                transformationData?.transformationConfig?.outputFormat
              )}
              isLoading={isPreviewLoading}
            />
          </div>
        </div>

        {/* Export Toolbar */}
        <div className="order-3">
          <ExportToolbar
            onExport={handleExport}
            onShare={handleShare}
            onTestWithDifferentData={handleTestWithDifferentData}
            onSaveToHistory={handleSaveToHistory}
            isExporting={isExporting}
          />
        </div>
      </main>
    </div>
  );
};

export default XSLTCodeGenerationPreview;