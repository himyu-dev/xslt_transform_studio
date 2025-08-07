import React from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import WelcomeHero from './components/WelcomeHero';
import RecentProjects from './components/RecentProjects';
import TransformationStats from './components/TransformationStats';
import QuickActions from './components/QuickActions';
import TipsPanel from './components/TipsPanel';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumb />
      
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <WelcomeHero />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Recent Projects */}
            <div className="lg:col-span-1">
              <RecentProjects />
            </div>

            {/* Middle Column - Statistics */}
            <div className="lg:col-span-1">
              <TransformationStats />
            </div>

            {/* Right Column - Quick Actions */}
            <div className="lg:col-span-1">
              <QuickActions />
            </div>
          </div>

          {/* Bottom Section - Tips Panel */}
          <div className="grid grid-cols-1">
            <TipsPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;