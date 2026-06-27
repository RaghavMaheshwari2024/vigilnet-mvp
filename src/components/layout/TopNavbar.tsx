import React, { useEffect, useState, useRef } from 'react';
import { useLayout } from '../../context/LayoutContext';
import {
  Home,
  Search,
  Plus,
  Bell,
  HelpCircle,
  Building2,
  Folder,
  ArrowRight,
  Clock,
  User,
  Check,
  AlertTriangle,
  FileText,
  Terminal,
  LogOut,
  ChevronDown
} from 'lucide-react';

export const TopNavbar: React.FC = () => {
  const {
    activeTab,
    searchOpen,
    setSearchOpen,
    notificationsOpen,
    setNotificationsOpen,
  } = useLayout();

  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScope, setSelectedScope] = useState('All');
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [activeNotifTab, setActiveNotifTab] = useState('All');

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Toggle handlers
  const handleSearchToggle = () => setSearchOpen(!searchOpen);
  const handleNotifToggle = () => setNotificationsOpen(!notificationsOpen);
  const handleProfileToggle = () => setProfileOpen(!profileOpen);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (searchOpen && searchRef.current && !searchRef.current.contains(target)) {
        setSearchOpen(false);
      }
      if (notificationsOpen && notifRef.current && !notifRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (profileOpen && profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [searchOpen, notificationsOpen, profileOpen, setSearchOpen, setNotificationsOpen]);

  // Keyboard shortcut listener (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev: boolean) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen, setNotificationsOpen]);

  // Mock search results
  const mockResults = [
    {
      id: 'r1',
      category: 'Entities',
      title: 'Nexus Corp LLC',
      sub: 'Entity · Cayman Islands · Risk 94 · OFAC Match',
      risk: 94,
      status: 'critical',
      icon: Building2,
    },
    {
      id: 'r2',
      category: 'Entities',
      title: 'Nexus Holdings AG',
      sub: 'Entity · Switzerland · Risk 71 · Under Review',
      risk: 71,
      status: 'warning',
      icon: Building2,
    },
    {
      id: 'r3',
      category: 'Cases',
      title: 'CAS-2025-0081 — Nexus Corp LLC',
      sub: 'Flagged · Assigned to J. Martinez · SAR Pending',
      risk: 88,
      status: 'critical',
      icon: Folder,
    },
    {
      id: 'r4',
      category: 'Transactions',
      title: 'TXN-2025-044821',
      sub: 'Nexus Corp LLC → Cayman Trust · $4,280,000',
      risk: 94,
      status: 'critical',
      icon: Clock,
    },
    {
      id: 'r5',
      category: 'Commands',
      title: 'New transaction intake form',
      sub: 'Open transaction manual ingestion wizard',
      risk: null,
      status: 'info',
      icon: Terminal,
    },
  ];

  // Filter search results based on query & scope
  const filteredResults = mockResults.filter(item => {
    const matchesQuery = searchQuery
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sub.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    if (!matchesQuery) return false;
    if (selectedScope === 'All') return true;
    if (selectedScope === 'Entities' && item.category === 'Entities') return true;
    if (selectedScope === 'Cases' && item.category === 'Cases') return true;
    if (selectedScope === 'Transactions' && item.category === 'Transactions') return true;
    if (selectedScope === 'Commands' && item.category === 'Commands') return true;
    return false;
  });

  // Mock notifications
  const notifications = [
    {
      id: 'n1',
      category: 'Critical',
      icon: AlertTriangle,
      iconColor: 'text-[#FF6B6B] bg-[#2D0F0F]',
      tag: 'Critical',
      tagColor: 'bg-[#2D0F0F] text-[#FF6B6B] border border-[rgba(255,107,107,0.15)]',
      event: 'OFAC sanctions match detected',
      time: '2 min ago',
      desc: 'Nexus Corp LLC matched SDN list entry #12844. Account suspended.',
      unread: true,
    },
    {
      id: 'n2',
      category: 'Critical',
      icon: FileText,
      iconColor: 'text-[#FF6B6B] bg-[#2D0F0F]',
      tag: 'Approval required',
      tagColor: 'bg-[#2A2010] text-[#F6A623] border border-[rgba(246,166,35,0.15)]',
      event: 'SAR pending your approval',
      time: '18 min ago',
      desc: 'CAS-2025-0081 · Orion Capital AG · Submitted by A. Patel.',
      unread: true,
    },
    {
      id: 'n3',
      category: 'Critical',
      icon: Clock,
      iconColor: 'text-[#F6A623] bg-[#2A2010]',
      tag: 'SLA warning',
      tagColor: 'bg-[#2A2010] text-[#F6A623] border border-[rgba(246,166,35,0.15)]',
      event: 'SLA breach in 2 hours',
      time: '34 min ago',
      desc: 'CAS-2025-0077 exceeds 72h review window at 18:30 UTC.',
      unread: true,
    },
    {
      id: 'n4',
      category: 'Assigned',
      icon: User,
      iconColor: 'text-[#63B3ED] bg-[#1A2A3F]',
      tag: 'Assignment',
      tagColor: 'bg-[#1A2A3F] text-[#63B3ED] border border-[rgba(99,179,237,0.2)]',
      event: 'Case assigned to you',
      time: '1 hr ago',
      desc: 'CAS-2025-0080 · Meridian Holdings — by S. Chen.',
      unread: false,
    },
    {
      id: 'n5',
      category: 'System',
      icon: Check,
      iconColor: 'text-[#52B788] bg-[#1A2D24]',
      tag: 'Completed',
      tagColor: 'bg-[#1A2D24] text-[#52B788] border border-[rgba(82,183,136,0.15)]',
      event: 'SAR submitted to FinCEN',
      time: '3 hr ago',
      desc: 'CAS-2025-0074 · Receipt #FCEN-2025-11-04-8821 stored.',
      unread: false,
    },
  ];

  const filteredNotifs = notifications.filter(notif => {
    if (activeNotifTab === 'All') return true;
    return notif.category === activeNotifTab;
  });

  return (
    <div className="relative h-[52px] bg-[#0F1217] border-b border-[#1E2535] flex items-center px-4 gap-[10px] select-none flex-shrink-0 z-40">

      {/* Breadcrumb Hierarchy */}
      <div className="flex items-center gap-[5px] flex-1 min-w-0">
        <div className="text-[#4A5568] hover:text-[#8C95A8] cursor-pointer flex items-center">
          <Home size={13} />
        </div>
        <span className="text-[#1E2535] text-[14px] font-light">/</span>
        <span className="text-[12px] text-[#4A5568] hover:text-[#8C95A8] cursor-pointer font-medium">
          Monitoring
        </span>
        <span className="text-[#1E2535] text-[14px] font-light">/</span>
        <span className="text-[12px] text-[#E8EBF0] font-semibold tracking-[0.01em]">
          {activeTab}
        </span>
        {activeTab === 'Dashboard' && (
          <div className="ml-3 flex items-center gap-[5px] bg-[#1A2A3F] border border-[rgba(43,108,176,0.25)] rounded-[3px] px-2 py-[3px] text-[10px] text-[#63B3ED] font-semibold tracking-[0.03em] whitespace-nowrap">
            Live Stream Connected
          </div>
        )}
      </div>

      {/* Command Search Bar Trigger */}
      <div
        onClick={handleSearchToggle}
        className="flex items-center gap-[6px] bg-[#141820] border border-[#1E2535] rounded-[4px] px-[10px] h-[30px] cursor-text min-width-[200px] max-w-[280px] flex-1 hover:border-[#2A3347] transition-colors"
      >
        <Search size={13} className="text-[#4A5568]" />
        <span className="text-[11px] text-[#4A5568] flex-1 text-left">
          Search alerts, cases, commands...
        </span>
        <span className="text-[9px] bg-[#1A2030] border border-[#2A3347] px-1.5 py-[1px] rounded-[2px] text-[#4A5568] font-mono whitespace-nowrap">
          ⌘K
        </span>
      </div>

      {/* Action Buttons */}
      <button className="w-[30px] h-[30px] flex items-center justify-center rounded-[4px] text-[#8C95A8] hover:bg-[#141820] hover:text-[#E8EBF0] transition-colors">
        <Plus size={16} />
      </button>

      <div className="w-[1px] h-5 bg-[#1E2535]" />

      {/* Notification Bell Trigger */}
      <div className="relative">
        <button
          onClick={handleNotifToggle}
          className={`w-[30px] h-[30px] flex items-center justify-center rounded-[4px] text-[#8C95A8] hover:bg-[#141820] hover:text-[#E8EBF0] transition-colors ${notificationsOpen ? 'bg-[#141820] text-[#E8EBF0]' : ''
            }`}
        >
          <Bell size={16} />
          {/* Critical notification pip */}
          <div className="absolute top-[5px] right-[5px] w-[6px] h-[6px] bg-[#FF6B6B] rounded-full border-[1.5px] border-[#0F1217]" />
        </button>

        {/* Dropdown Notification Panel */}
        {notificationsOpen && (
          <div
            ref={notifRef}
            className="absolute right-0 mt-2 w-[340px] bg-[#0F1217] border border-[#1E2535] rounded-[6px] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-[12px_14px] border-b border-[#1E2535]">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-[#E8EBF0]">
                  Notifications
                </span>
                <span className="bg-[#2D0F0F] text-[#FF6B6B] text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-[rgba(255,107,107,0.2)]">
                  8
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-[10px] text-[#8C95A8] hover:text-[#E8EBF0] transition-colors">
                  Mark all read
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#1E2535] px-[14px]">
              {['All', 'Critical', 'System', 'Assigned'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveNotifTab(tab)}
                  className={`text-[11px] py-2 px-2 border-b-2 -mb-[1px] transition-colors ${activeNotifTab === tab
                    ? 'text-[#E8EBF0] border-[#2B6CB0] font-semibold'
                    : 'text-[#4A5568] border-transparent hover:text-[#8C95A8]'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="max-h-[300px] overflow-y-auto">
              {filteredNotifs.length > 0 ? (
                filteredNotifs.map(item => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={`flex gap-3.5 p-[11px_14px] border-b border-[#1E2535] hover:bg-[#141820] cursor-pointer transition-colors ${item.unread ? 'bg-[#141820]/40' : ''
                        }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] flex-shrink-0 mt-0.5 ${item.iconColor}`}>
                        <IconComp size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="text-[11px] font-semibold text-[#E8EBF0] leading-[1.3] truncate">
                            {item.event}
                          </span>
                          <span className="text-[10px] text-[#4A5568] ml-auto whitespace-nowrap">
                            {item.time}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#8C95A8] leading-[1.4] mb-1.5">
                          {item.desc}
                        </div>
                        <span className={`inline-block text-[9px] font-bold tracking-[0.04em] px-1.5 py-[1px] rounded-[2px] uppercase ${item.tagColor}`}>
                          {item.tag}
                        </span>
                      </div>
                      {item.unread && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2B6CB0] flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-[#4A5568] text-[11px]">
                  No notifications in this category
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-[#1E2535] text-center bg-[#0F1217]">
              <button className="text-[10px] text-[#8C95A8] hover:text-[#E8EBF0] transition-colors">
                View all notifications
              </button>
            </div>
          </div>
        )}
      </div>

      <button className="w-[30px] h-[30px] flex items-center justify-center rounded-[4px] text-[#8C95A8] hover:bg-[#141820] hover:text-[#E8EBF0] transition-colors">
        <HelpCircle size={16} />
      </button>

      <div className="w-[1px] h-5 bg-[#1E2535]" />

      {/* User Profile Trigger */}
      <div className="relative">
        <div
          onClick={handleProfileToggle}
          className="flex items-center gap-1.5 cursor-pointer group"
          ref={profileRef}
        >
          <div className="w-7 h-7 rounded-full bg-[#1A2A3F] border-[1.5px] border-[#2A3347] flex items-center justify-center text-[10px] font-bold text-[#63B3ED] group-hover:border-[#2B6CB0] transition-colors">
            RM
          </div>
          <ChevronDown size={11} className="text-[#4A5568] group-hover:text-[#8C95A8] transition-colors" />
        </div>

        {/* Profile Dropdown Panel */}
        {profileOpen && (
          <div className="absolute right-0 mt-2 w-[220px] bg-[#0F1217] border border-[#1E2535] rounded-[6px] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-[14px] border-b border-[#1E2535]">
              <div className="w-10 h-10 rounded-full bg-[#1A2A3F] border-[1.5px] border-[#2A3347] flex items-center justify-center text-[14px] font-bold text-[#63B3ED] mb-2">
                RM
              </div>
              <div className="text-[12px] font-semibold text-[#E8EBF0]">
                Raghav Maheshwari
              </div>
              <div className="text-[10px] text-[#8C95A8]">
                Lead AML Investigator
              </div>
              <div className="text-[9px] text-[#4A5568] font-mono mt-1 select-all">
                j.martinez@vigilnet.ai
              </div>
              <div className="inline-flex items-center gap-1 bg-[#1A2030] border border-[#1E2535] rounded-[3px] px-1.5 py-0.5 text-[9px] text-[#8C95A8] mt-2 tracking-[0.03em]">
                FIN-US Group
              </div>
            </div>
            <div className="py-1">
              <button
                onClick={() => alert('Support page is under development.')}
                className="w-full text-left flex items-center gap-2.5 px-[14px] py-2 text-[12px] text-[#8C95A8] hover:bg-[#141820] hover:text-[#E8EBF0] transition-colors"
              >
                <HelpCircle size={14} />
                <span>Support Portal</span>
                <span className="ml-auto text-[9px] text-[#4A5568]">External</span>
              </button>
            </div>
            <div className="border-t border-[#1E2535] py-1">
              <button
                onClick={() => alert('Log out is disabled in Demo mode.')}
                className="w-full text-left flex items-center gap-2.5 px-[14px] py-2 text-[12px] text-[#FF6B6B] hover:bg-[#2D0F0F] transition-colors"
              >
                <LogOut size={14} />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Command Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-[#0A0C0F]/85 backdrop-blur-[2px] flex items-start justify-center pt-[10%] z-50 animate-in fade-in duration-200">
          <div
            ref={searchRef}
            className="w-[560px] max-h-[520px] bg-[#0F1217] border border-[#1E2535] rounded-[6px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
          >
            {/* Search Input */}
            <div className="flex items-center gap-2 px-[14px] py-3 border-b border-[#1E2535]">
              <Search size={16} className="text-[#4A5568]" />
              <input
                autoFocus
                type="text"
                placeholder="Search entities, transactions, cases, commands..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setSelectedResultIndex(0);
                }}
                className="bg-transparent border-none outline-none text-[13px] text-[#E8EBF0] flex-1 placeholder-[#4A5568] caret-[#2B6CB0]"
              />
              <span className="text-[9px] bg-[#1A2030] border border-[#2A3347] px-1.5 py-[2px] rounded-[2px] text-[#4A5568] font-mono cursor-pointer" onClick={() => setSearchOpen(false)}>
                ESC
              </span>
            </div>

            {/* Scope Pills */}
            <div className="flex gap-1 py-2 px-[14px] border-b border-[#1E2535] overflow-x-auto whitespace-nowrap">
              {['All', 'Entities', 'Cases', 'Transactions', 'Commands'].map(scope => (
                <button
                  key={scope}
                  onClick={() => {
                    setSelectedScope(scope);
                    setSelectedResultIndex(0);
                  }}
                  className={`text-[10px] px-2.5 py-[3px] rounded-full border transition-all ${selectedScope === scope
                    ? 'bg-[#1A2A3F] text-[#63B3ED] border-[rgba(43,108,176,0.35)]'
                    : 'bg-[#141820] text-[#4A5568] border-[#1E2535] hover:border-[#2A3347] hover:text-[#8C95A8]'
                    }`}
                >
                  {scope}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto py-2">
              {filteredResults.length > 0 ? (
                <div>
                  <div className="text-[9px] tracking-[0.1em] uppercase text-[#4A5568] font-bold px-[14px] py-1">
                    Matching Results ({filteredResults.length})
                  </div>
                  {filteredResults.map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <div
                        key={item.id}
                        onMouseEnter={() => setSelectedResultIndex(idx)}
                        className={`flex items-center gap-2.5 px-[14px] py-2 cursor-pointer transition-colors ${selectedResultIndex === idx ? 'bg-[#141820]' : ''
                          }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-[3px] flex items-center justify-center text-[12px] flex-shrink-0 ${item.status === 'critical'
                            ? 'bg-[#2D0F0F] text-[#FF6B6B]'
                            : item.status === 'warning'
                              ? 'bg-[#2A2010] text-[#F6A623]'
                              : 'bg-[#1A2A3F] text-[#63B3ED]'
                            }`}
                        >
                          <IconComp size={12} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] text-[#E8EBF0] font-medium leading-[1.3] truncate">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-[#4A5568] leading-[1.3]">
                            {item.sub}
                          </div>
                        </div>
                        {selectedResultIndex === idx && (
                          <ArrowRight size={12} className="text-[#4A5568] animate-in slide-in-from-left-1 duration-100" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center text-[#4A5568] text-[12px]">
                  No matching results found for "{searchQuery}"
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3.5 p-[8px_14px] border-t border-[#1E2535] bg-[#0F1217]/50 select-none">
              <span className="inline-flex items-center gap-1 text-[10px] text-[#4A5568]">
                <kbd className="text-[9px] bg-[#1A2030] border border-[#2A3347] px-1 rounded-[2px] font-mono">↑↓</kbd> navigate
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#4A5568]">
                <kbd className="text-[9px] bg-[#1A2030] border border-[#2A3347] px-1 rounded-[2px] font-mono">↵</kbd> open
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#4A5568]">
                <kbd className="text-[9px] bg-[#1A2030] border border-[#2A3347] px-1.5 rounded-[2px] font-mono">ESC</kbd> close
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
