import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CodeEditor = ({ xsltCode, onCodeChange, validationErrors = [] }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  const lines = xsltCode?.split('\n');
  const hasErrors = validationErrors?.length > 0;

  const handleSearch = () => {
    if (!searchTerm || !textareaRef?.current) return;
    
    const textarea = textareaRef?.current;
    const text = textarea?.value;
    const index = text?.toLowerCase()?.indexOf(searchTerm?.toLowerCase());
    
    if (index !== -1) {
      textarea?.focus();
      textarea?.setSelectionRange(index, index + searchTerm?.length);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Tab') {
      e?.preventDefault();
      const textarea = e?.target;
      const start = textarea?.selectionStart;
      const end = textarea?.selectionEnd;
      const value = textarea?.value;
      
      textarea.value = value?.substring(0, start) + '  ' + value?.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      onCodeChange(textarea?.value);
    }
  };

  useEffect(() => {
    if (isFullscreen && editorRef?.current) {
      editorRef?.current?.requestFullscreen?.();
    } else if (!isFullscreen && document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  return (
    <div 
      ref={editorRef}
      className={`
        bg-card border border-border rounded-lg overflow-hidden elevation-1
        ${isFullscreen ? 'fixed inset-0 z-1000' : ''}
      `}
    >
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="Code2" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">XSLT Code</span>
          </div>
          
          {hasErrors && (
            <div className="flex items-center space-x-1 text-error">
              <Icon name="AlertCircle" size={14} />
              <span className="text-xs">{validationErrors?.length} error(s)</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            iconName="Search"
            className="h-8 w-8 p-0"
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLineNumbers(!lineNumbers)}
            iconName="Hash"
            className="h-8 w-8 p-0"
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            iconName={isFullscreen ? "Minimize2" : "Maximize2"}
            className="h-8 w-8 p-0"
          />
        </div>
      </div>
      {/* Search Bar */}
      {showSearch && (
        <div className="flex items-center space-x-2 px-4 py-2 border-b border-border bg-muted/20">
          <Icon name="Search" size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search in code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            onKeyDown={(e) => e?.key === 'Enter' && handleSearch()}
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground border-none outline-none"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearch}
            iconName="Search"
            className="h-6 w-6 p-0"
          />
        </div>
      )}
      {/* Code Editor Area */}
      <div className="relative flex h-96 lg:h-[500px]">
        {/* Line Numbers */}
        {lineNumbers && (
          <div className="w-12 bg-muted/50 border-r border-border flex-shrink-0 overflow-hidden">
            <div className="py-4 px-2 text-xs text-muted-foreground font-mono leading-6">
              {lines?.map((_, index) => (
                <div key={index} className="text-right">
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Content */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={xsltCode}
            onChange={(e) => onCodeChange(e?.target?.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-4 bg-transparent text-sm font-mono text-foreground resize-none border-none outline-none leading-6"
            placeholder="Generated XSLT code will appear here..."
            spellCheck={false}
          />
          
          {/* Error Indicators */}
          {validationErrors?.map((error, index) => (
            <div
              key={index}
              className="absolute right-2 bg-error text-error-foreground text-xs px-2 py-1 rounded shadow-sm"
              style={{ top: `${error?.line * 24 + 16}px` }}
              title={error?.message}
            >
              !
            </div>
          ))}
        </div>
      </div>
      {/* Editor Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>Lines: {lines?.length}</span>
          <span>Characters: {xsltCode?.length}</span>
          <span>Language: XSLT</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasErrors ? (
            <span className="text-error">Validation Failed</span>
          ) : (
            <span className="text-success">Valid XSLT</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;