import React from 'react';
import Header from './Header';

const Layout = ({ children, headerVariant = 'default', pageSubtitle = '' }) => {
  return (
    <div className="app-layout">
      <Header variant={headerVariant} subtitle={pageSubtitle} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;