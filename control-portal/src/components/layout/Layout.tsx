import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          margin-left: 260px; /* Sidebar width */
          display: flex;
          flex-direction: column;
        }

        .page-content {
          flex: 1;
          padding: 2rem;
          background-color: var(--background);
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};
