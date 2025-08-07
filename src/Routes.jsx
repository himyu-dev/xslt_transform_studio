import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import XSLTCodeGenerationPreview from './pages/xslt-code-generation-preview';
import DataInputTransformationSetup from './pages/data-input-transformation-setup';
import UserDashboard from './pages/user-dashboard-quick-actions';
import TransformationHistoryManagement from './pages/transformation-history-management';
import TransformationTestingValidation from './pages/transformation-testing-validation';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<DataInputTransformationSetup />} />
        <Route path="/xslt-code-generation-preview" element={<XSLTCodeGenerationPreview />} />
        <Route path="/data-input-transformation-setup" element={<DataInputTransformationSetup />} />
        <Route path="/user-dashboard-quick-actions" element={<UserDashboard />} />
        <Route path="/transformation-history-management" element={<TransformationHistoryManagement />} />
        <Route path="/transformation-testing-validation" element={<TransformationTestingValidation />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
