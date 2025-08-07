import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const XSLTCodeViewer = ({ xsltCode, onCodeChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const mockXSLTCode = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="yes"/>
  
  <!-- Root template -->
  <xsl:template match="/">
    <transformed-data>
      <xsl:apply-templates select="//users/user"/>
    </transformed-data>
  </xsl:template>
  
  <!-- User template -->
  <xsl:template match="user">
    <person>
      <xsl:attribute name="id">
        <xsl:value-of select="@id"/>
      </xsl:attribute>
      <full-name>
        <xsl:value-of select="name"/>
      </full-name>
      <email-address>
        <xsl:value-of select="email"/>
      </email-address>
      <user-role>
        <xsl:value-of select="role"/>
      </user-role>
      <status>
        <xsl:choose>
          &lt;xsl:when test="role='admin'"&gt;administrator&lt;/xsl:when&gt;
          &lt;xsl:otherwise&gt;standard-user&lt;/xsl:otherwise&gt;
        </xsl:choose>
      </status>
    </person>
  </xsl:template>
  
</xsl:stylesheet>`;

  const currentCode = xsltCode || mockXSLTCode;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(currentCode);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([currentCode], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transformation.xsl';
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleEditable = () => {
    setIsEditable(!isEditable);
  };

  return (
    <div className={`bg-card border border-border rounded-lg h-full flex flex-col ${isExpanded ? 'fixed inset-4 z-50' : ''}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-foreground">XSLT Code</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground">Valid</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleEditable}
              iconName={isEditable ? "Lock" : "Edit"}
              iconPosition="left"
            >
              {isEditable ? 'Lock' : 'Edit'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyCode}
              iconName="Copy"
              iconPosition="left"
            >
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadCode}
              iconName="Download"
              iconPosition="left"
            >
              Download
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleExpanded}
            >
              <Icon name={isExpanded ? "Minimize2" : "Maximize2"} size={16} />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="h-full relative">
          <textarea
            value={currentCode}
            onChange={(e) => onCodeChange && onCodeChange(e?.target?.value)}
            readOnly={!isEditable}
            className={`
              w-full h-full p-3 border border-border rounded-md font-mono text-sm resize-none
              focus:outline-none focus:ring-2 focus:ring-primary
              ${isEditable 
                ? 'bg-background text-foreground' 
                : 'bg-muted text-muted-foreground cursor-default'
              }
            `}
            style={{ minHeight: '400px' }}
          />
          
          {!isEditable && (
            <div className="absolute top-2 right-2">
              <div className="bg-muted px-2 py-1 rounded text-xs text-muted-foreground">
                Read Only
              </div>
            </div>
          )}
        </div>

        {/* Code Statistics */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Lines: {currentCode?.split('\n')?.length}</span>
            <span>Size: {(currentCode?.length / 1024)?.toFixed(1)} KB</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={14} className="text-success" />
            <span>Syntax Valid</span>
          </div>
        </div>
      </div>
      {/* Collapsible Sections Info */}
      <div className="px-4 pb-4">
        <div className="bg-muted rounded-md p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Code Sections</span>
            <div className="flex items-center space-x-4 text-xs">
              <span className="text-primary">Templates: 2</span>
              <span className="text-accent">Variables: 0</span>
              <span className="text-warning">Functions: 0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XSLTCodeViewer;