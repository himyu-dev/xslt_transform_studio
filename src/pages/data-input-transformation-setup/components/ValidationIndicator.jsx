import React from 'react';
import Icon from '../../../components/AppIcon';

const ValidationIndicator = ({ 
  validationStatus, 
  inputFormat, 
  dataLength 
}) => {
  const getStatusColor = () => {
    if (!validationStatus?.isValid && validationStatus?.errors?.length > 0) {
      return 'error';
    }
    if (validationStatus?.isValid && dataLength > 0) {
      return 'success';
    }
    return 'muted';
  };

  const getStatusIcon = () => {
    if (!validationStatus?.isValid && validationStatus?.errors?.length > 0) {
      return 'AlertCircle';
    }
    if (validationStatus?.isValid && dataLength > 0) {
      return 'CheckCircle';
    }
    return 'Circle';
  };

  const getStatusText = () => {
    if (!validationStatus?.isValid && validationStatus?.errors?.length > 0) {
      return `${validationStatus?.errors?.length} validation error${validationStatus?.errors?.length > 1 ? 's' : ''}`;
    }
    if (validationStatus?.isValid && dataLength > 0) {
      return `Valid ${inputFormat?.toUpperCase()} format`;
    }
    return 'No data provided';
  };

  const statusColor = getStatusColor();
  const statusIcon = getStatusIcon();
  const statusText = getStatusText();

  return (
    <div className={`
      flex items-center space-x-2 px-3 py-2 rounded-md text-sm
      ${statusColor === 'error' ? 'bg-error/10 text-error' : ''}
      ${statusColor === 'success' ? 'bg-success/10 text-success' : ''}
      ${statusColor === 'muted' ? 'bg-muted/50 text-muted-foreground' : ''}
    `}>
      <Icon 
        name={statusIcon} 
        size={16} 
        className={`
          ${statusColor === 'error' ? 'text-error' : ''}
          ${statusColor === 'success' ? 'text-success' : ''}
          ${statusColor === 'muted' ? 'text-muted-foreground' : ''}
        `}
      />
      <span className="font-medium">{statusText}</span>
      {dataLength > 0 && (
        <>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            {dataLength?.toLocaleString()} characters
          </span>
        </>
      )}
    </div>
  );
};

export default ValidationIndicator;