/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Home } from './pages/Home';
import { Storefront } from './pages/Storefront';
import { Search } from './pages/Search';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { AddProduct } from './pages/AddProduct';
import { Sidebar } from './components/layout/Sidebar';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex overflow-x-hidden font-sans">
      {/* Persistent Sidebar (responsive handling inside the component) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Content Container */}
      <div className="flex-grow flex flex-col min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/products/new" element={<AddProduct />} />
            <Route path="/:username" element={<Storefront />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
