import { useState } from "react";
import { Link } from "react-router-dom";

export default function DashboardLayout({ sidebar, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-57px)] bg-background-base relative animate-fade-in">

      {/* Mobile Sidebar Toggle (below navbar) */}
      <div className="md:hidden bg-surface border-b border-outline-variant p-3 flex justify-between items-center fixed top-[57px] w-full z-20">
        <span className="text-sm font-semibold text-on-surface">Menu</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
        >
          <span className="material-icons-round text-xl">{isOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-[57px] left-0 z-30 w-64 bg-surface border-r border-outline-variant p-6 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 h-[calc(100vh-57px)] overflow-y-auto`}>
        <div onClick={() => setIsOpen(false)}>
          {sidebar}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mt-12 md:mt-0 w-full h-[calc(100vh-57px)] overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}