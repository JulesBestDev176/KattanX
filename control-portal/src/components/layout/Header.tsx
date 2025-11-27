import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Rechercher des alertes, agents ou lieux..." />
      </div>

      <div className="header-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="name">Officier Admin</span>
            <span className="role">Centre de Contrôle</span>
          </div>
        </div>
      </div>

      <style>{`
        .header {
          height: 70px;
          background-color: white;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background-color: var(--muted);
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          width: 400px;
        }

        .search-icon {
          color: var(--muted-foreground);
          margin-right: 0.5rem;
        }

        .search-bar input {
          border: none;
          background: none;
          outline: none;
          width: 100%;
          color: var(--foreground);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .icon-btn {
          background: none;
          border: none;
          position: relative;
          color: var(--muted-foreground);
          padding: 0.5rem;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .icon-btn:hover {
          background-color: var(--muted);
          color: var(--foreground);
        }

        .badge {
          position: absolute;
          top: 0;
          right: 0;
          background-color: var(--destructive);
          color: white;
          font-size: 0.7rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background-color: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .role {
          font-size: 0.8rem;
          color: var(--muted-foreground);
        }
      `}</style>
    </header>
  );
};
