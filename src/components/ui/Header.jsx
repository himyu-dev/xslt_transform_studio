import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/user-dashboard-quick-actions',
      icon: 'LayoutDashboard',
      tooltip: 'Project overview and quick actions'
    },
    {
      label: 'Transform',
      path: '/data-input-transformation-setup',
      icon: 'FileInput',
      tooltip: 'Data input and transformation setup'
    },
    {
      label: 'Generate',
      path: '/xslt-code-generation-preview',
      icon: 'Code',
      tooltip: 'XSLT code generation and preview'
    },
    {
      label: 'Test',
      path: '/transformation-testing-validation',
      icon: 'TestTube',
      tooltip: 'Validation and testing interface'
    },
    {
      label: 'History',
      path: '/transformation-history-management',
      icon: 'History',
      tooltip: 'Project management and history'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-1000 bg-card border-b border-border elevation-1">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer transition-smooth hover:opacity-80"
            onClick={() => handleNavigation('/user-dashboard-quick-actions')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Code2" size={20} color="white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground leading-tight">
                  XSLT Transform Studio
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth
                  ${isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
                title={item?.tooltip}
              >
                <Icon name={item?.icon} size={16} strokeWidth={2} />
                <span>{item?.label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-1100 md:hidden">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={toggleMobileMenu} />
            <div className="relative bg-card border-b border-border elevation-2">
              <nav className="px-6 py-4 space-y-2">
                {navigationItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`
                      flex items-center space-x-3 w-full px-4 py-3 rounded-md text-left transition-smooth
                      ${isActivePath(item?.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <Icon name={item?.icon} size={20} strokeWidth={2} />
                    <div className="flex flex-col">
                      <span className="font-medium">{item?.label}</span>
                      <span className="text-xs opacity-75">{item?.tooltip}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>
      {/* Spacer to prevent content overlap */}
      <div className="h-16" />
    </>
  );
};

export default Header;