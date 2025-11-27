import React from 'react';
import { LayoutDashboard, Camera, Users, Bell, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/' },
    { icon: Camera, label: 'Surveillance', path: '/surveillance' },
    { icon: Bell, label: 'Alertes', path: '/alerts' },
    { icon: Users, label: 'Agents', path: '/agents' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <h1 className="logo-text">KattanX <span className="logo-sub">Contrôle</span></h1>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="bottom-menu">
        <button className="nav-item logout">
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background-color: var(--primary);
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
        }

        .logo-container {
          padding: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .logo-sub {
          color: var(--secondary);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .nav-menu {
          padding: 2rem 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          border-radius: var(--radius);
          transition: all 0.2s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-size: 1rem;
        }

        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .nav-item.active {
          background-color: var(--secondary);
          color: white;
          font-weight: 600;
        }

        .bottom-menu {
          padding: 2rem 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logout {
          color: #fca5a5;
        }
        .logout:hover {
          background-color: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }
      `}</style>
    </aside>
  );
};
