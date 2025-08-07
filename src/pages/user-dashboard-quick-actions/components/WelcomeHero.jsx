import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WelcomeHero = () => {
  const navigate = useNavigate();

  const handleStartTransformation = () => {
    navigate('/data-input-transformation-setup');
  };

  return (
    <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-8 text-white mb-8">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="flex-1 mb-6 lg:mb-0">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Welcome to XSLT Transform Studio
          </h1>
          <p className="text-lg opacity-90 mb-6 max-w-2xl">
            Transform your JSON and XML data effortlessly with our automated XSLT code generation. 
            Build, test, and deploy data transformations with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleStartTransformation}
              iconName="Plus"
              iconPosition="left"
              className="bg-white text-primary hover:bg-gray-50"
            >
              Start New Transformation
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/transformation-history-management')}
              iconName="History"
              iconPosition="left"
              className="text-white border-white hover:bg-white/10"
            >
              View History
            </Button>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-32 h-32 lg:w-40 lg:h-40 bg-white/10 rounded-full flex items-center justify-center">
            <Icon name="Code2" size={64} color="white" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHero;