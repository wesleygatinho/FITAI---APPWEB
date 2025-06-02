
import React, { useState, useCallback } from 'react';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import LiveMonitoring from './components/LiveMonitoring/LiveMonitoring';
import DataLogging from './components/DataLogging/DataLogging';
import MirrorFilters from './components/MirrorFilters/MirrorFilters';
import WorkoutIdeas from './components/WorkoutIdeas/WorkoutIdeas';
import { Tab } from './types';
import { FitnessIcon, ChartIcon, CameraIcon, LightBulbIcon } from './constants';


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('monitor');

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'monitor':
        return <LiveMonitoring />;
      case 'logging':
        return <DataLogging />;
      case 'mirror':
        return <MirrorFilters />;
      case 'ideas':
        return <WorkoutIdeas />;
      default:
        return <LiveMonitoring />;
    }
  };

  const navItems = [
    { id: 'monitor' as Tab, label: 'Monitorar', icon: <FitnessIcon className="w-5 h-5 mr-2" /> },
    { id: 'logging' as Tab, label: 'Registrar Dados', icon: <ChartIcon className="w-5 h-5 mr-2" /> },
    { id: 'mirror' as Tab, label: 'Espelho FIT', icon: <CameraIcon className="w-5 h-5 mr-2" /> },
    { id: 'ideas' as Tab, label: 'Ideias Fit', icon: <LightBulbIcon className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Header activeTab={activeTab} setActiveTab={handleTabChange} navItems={navItems} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
    