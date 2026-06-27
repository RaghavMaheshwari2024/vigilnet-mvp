import React from 'react';
import { useLayout } from '../../context/LayoutContext';
import { VigilNetLogo } from './VigilNetLogo';
import {
  LayoutDashboard,
  Bell,
  Folder,
  ArrowDownLeft,
  ListTodo,
  Building2,
  Network,
  MapPin,
  ShieldAlert,
  FileText,
  BarChart3,
  Calendar,
  Users,
  Sliders,
  Activity,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ComponentType<any>;
  label: string;
  badge?: number;
  badgeType?: 'critical' | 'warning' | 'neutral';
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  badge,
  badgeType = 'neutral',
  active,
  onClick,
  collapsed,
}) => {
  const getBadgeClass = () => {
    switch (badgeType) {
      case 'critical':
        return 'bg-[#2D0F0F] text-[#FF6B6B] border border-[rgba(255,107,107,0.2)]';
      case 'warning':
        return 'bg-[#2A2010] text-[#F6A623] border border-[rgba(246,166,35,0.2)]';
      case 'neutral':
      default:
        return 'bg-[#1A2030] text-[#8C95A8] border border-[#1E2535]';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center h-[34px] px-4 cursor-pointer select-none transition-all duration-150 ${
        active ? 'bg-[#141820] text-[#E8EBF0]' : 'text-[#8C95A8] hover:bg-[#141820]/50 hover:text-[#E8EBF0]'
      }`}
    >
      {/* Active Indicator Bar */}
      {active && (
        <div className="absolute left-0 top-[6px] bottom-[6px] w-[2px] bg-[#2B6CB0] rounded-r-[1px]" />
      )}

      {/* Icon */}
      <div className="flex items-center justify-center w-4 h-4 flex-shrink-0">
        <Icon size={15} className={active ? 'text-[#2B6CB0]' : ''} />
      </div>

      {/* Label and Badge (Expanded State) */}
      {!collapsed && (
        <>
          <span className="ml-[9px] text-[12px] font-medium tracking-[0.01em] whitespace-nowrap">
            {label}
          </span>
          {badge !== undefined && (
            <span
              className={`ml-auto h-4 min-w-[20px] px-1 rounded-[8px] flex items-center justify-center text-[9px] font-bold tracking-[0.02em] ${getBadgeClass()}`}
            >
              {badge}
            </span>
          )}
        </>
      )}

      {/* Collapsed State Tooltip and Mini Pip */}
      {collapsed && (
        <>
          {badge !== undefined && badgeType === 'critical' && (
            <div className="absolute top-[6px] right-2 w-[5px] h-[5px] rounded-full bg-[#FF6B6B] border border-[#0F1217]" />
          )}
          {badge !== undefined && badgeType === 'warning' && (
            <div className="absolute top-[6px] right-2 w-[5px] h-[5px] rounded-full bg-[#F6A623] border border-[#0F1217]" />
          )}
          
          <div className="absolute left-[54px] z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-[#1A2030] border border-[#2A3347] rounded-[3px] py-1 px-2 text-[10px] text-[#E8EBF0] shadow-lg whitespace-nowrap">
            {label}
            {badge !== undefined && (
              <span className="ml-2 font-mono text-[9px] text-[#4A5568]">
                {badge}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const { isSidebarExpanded, toggleSidebar, activeTab, setActiveTab } = useLayout();

  return (
    <div
      className={`bg-[#0F1217] border-r border-[#1E2535] flex flex-col min-h-screen transition-all duration-300 ${
        isSidebarExpanded ? 'w-[220px]' : 'w-[48px]'
      }`}
    >
      {/* Sidebar Header/Wordmark */}
      <div className="h-[52px] flex items-center px-4 border-b border-[#1E2535] gap-[10px] flex-shrink-0 select-none">
        <VigilNetLogo size={24} hideText={!isSidebarExpanded} />

        {/* Collapse Button */}
        {isSidebarExpanded && (
          <button
            onClick={toggleSidebar}
            className="ml-auto w-5 h-5 flex items-center justify-center rounded-[3px] text-[#4A5568] hover:bg-[#1A2030] hover:text-[#8C95A8] transition-colors"
          >
            <ChevronLeft size={13} />
          </button>
        )}
        {!isSidebarExpanded && (
          <button
            onClick={toggleSidebar}
            className="w-full flex justify-center py-2 text-[#4A5568] hover:text-[#8C95A8] transition-colors"
          >
            <ChevronRight size={13} />
          </button>
        )}
      </div>

      {/* Navigation Groups Container */}
      <div className="flex-1 py-2 overflow-y-auto overflow-x-hidden space-y-4">
        {/* Monitoring Group */}
        <div>
          {isSidebarExpanded && (
            <div className="text-[9px] tracking-[0.1em] uppercase text-[#4A5568] px-4 py-1 font-bold">
              Monitoring
            </div>
          )}
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeTab === 'Dashboard'}
            onClick={() => setActiveTab('Dashboard')}
            collapsed={!isSidebarExpanded}
          />
          <SidebarItem
            icon={Bell}
            label="Alerts"
            badge={47}
            badgeType="critical"
            active={activeTab === 'Alerts'}
            onClick={() => setActiveTab('Alerts')}
            collapsed={!isSidebarExpanded}
          />

          {/* Sub-items for Alerts in Expanded State */}
          {isSidebarExpanded && activeTab === 'Alerts' && (
            <div className="flex flex-col">
              <div className="flex items-center h-[30px] pl-10 pr-4 text-[11px] text-[#4A5568] hover:bg-[#141820]/40 hover:text-[#8C95A8] cursor-pointer">
                <span className="w-[4px] h-[4px] rounded-full bg-current mr-2 flex-shrink-0" />
                <span>Open</span>
                <span className="ml-auto text-[9px] font-bold text-[#FF6B6B] bg-[#2D0F0F] px-1.5 py-0.2 rounded-full border border-[rgba(255,107,107,0.15)]">31</span>
              </div>
              <div className="flex items-center h-[30px] pl-10 pr-4 text-[11px] text-[#4A5568] hover:bg-[#141820]/40 hover:text-[#8C95A8] cursor-pointer">
                <span className="w-[4px] h-[4px] rounded-full bg-current mr-2 flex-shrink-0" />
                <span>In review</span>
                <span className="ml-auto text-[9px] font-bold text-[#F6A623] bg-[#2A2010] px-1.5 py-0.2 rounded-full border border-[rgba(246,166,35,0.15)]">16</span>
              </div>
            </div>
          )}

          <SidebarItem
            icon={Folder}
            label="Cases"
            badge={284}
            badgeType="neutral"
            active={activeTab === 'Cases'}
            onClick={() => setActiveTab('Cases')}
            collapsed={!isSidebarExpanded}
          />
          <SidebarItem
            icon={ArrowDownLeft}
            label="Transactions"
            active={activeTab === 'Transactions'}
            onClick={() => setActiveTab('Transactions')}
            collapsed={!isSidebarExpanded}
          />
          <SidebarItem
            icon={ListTodo}
            label="Priority queue"
            badge={12}
            badgeType="warning"
            active={activeTab === 'Priority queue'}
            onClick={() => setActiveTab('Priority queue')}
            collapsed={!isSidebarExpanded}
          />
        </div>

        {isSidebarExpanded && <div className="h-[1px] bg-[#1E2535] mx-4 my-1" />}

        {/* Intelligence Group */}
        <div>
          {isSidebarExpanded && (
            <div className="text-[9px] tracking-[0.1em] uppercase text-[#4A5568] px-4 py-1 font-bold">
              Intelligence
            </div>
          )}
          <SidebarItem
            icon={Building2}
            label="Entities"
            active={activeTab === 'Entities'}
            onClick={() => setActiveTab('Entities')}
            collapsed={!isSidebarExpanded}
          />
          <SidebarItem
            icon={Network}
            label="Graph explorer"
            active={activeTab === 'Graph explorer'}
            onClick={() => setActiveTab('Graph explorer')}
            collapsed={!isSidebarExpanded}
          />
          <SidebarItem
            icon={MapPin}
            label="Jurisdictions"
            active={activeTab === 'Jurisdictions'}
            onClick={() => setActiveTab('Jurisdictions')}
            collapsed={!isSidebarExpanded}
          />
          <SidebarItem
            icon={ShieldAlert}
            label="Sanctions lists"
            active={activeTab === 'Sanctions lists'}
            onClick={() => setActiveTab('Sanctions lists')}
            collapsed={!isSidebarExpanded}
          />
        </div>

        {isSidebarExpanded && <div className="h-[1px] bg-[#1E2535] mx-4 my-1" />}

        {/* Reports Group */}
        <div>
          {isSidebarExpanded && (
            <div className="text-[9px] tracking-[0.1em] uppercase text-[#4A5568] px-4 py-1 font-bold">
              Reports
            </div>
          )}
          <SidebarItem
            icon={FileText}
            label="STR / SAR"
            badge={3}
            badgeType="warning"
            active={activeTab === 'STR / SAR'}
            onClick={() => setActiveTab('STR / SAR')}
            collapsed={!isSidebarExpanded}
          />
          <SidebarItem
            icon={BarChart3}
            label="Analytics"
            active={activeTab === 'Analytics'}
            onClick={() => setActiveTab('Analytics')}
            collapsed={!isSidebarExpanded}
          />
          <SidebarItem
            icon={Calendar}
            label="Period reports"
            active={activeTab === 'Period reports'}
            onClick={() => setActiveTab('Period reports')}
            collapsed={!isSidebarExpanded}
          />
        </div>

        {isSidebarExpanded && <div className="h-[1px] bg-[#1E2535] mx-4 my-1" />}

        {/* Admin Group */}
        <div>
          {isSidebarExpanded && (
            <div className="text-[9px] tracking-[0.1em] uppercase text-[#4A5568] px-4 py-1 font-bold">
              Admin
            </div>
          )}
          <SidebarItem
            icon={Users}
            label="Team"
            active={activeTab === 'Team'}
            onClick={() => setActiveTab('Team')}
            collapsed={!isSidebarExpanded}
          />
          <SidebarItem
            icon={Sliders}
            label="Configuration"
            active={activeTab === 'Configuration'}
            onClick={() => setActiveTab('Configuration')}
            collapsed={!isSidebarExpanded}
          />
          <SidebarItem
            icon={Activity}
            label="Audit log"
            active={activeTab === 'Audit log'}
            onClick={() => setActiveTab('Audit log')}
            collapsed={!isSidebarExpanded}
          />
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-[#1E2535] py-2 flex-shrink-0 bg-[#0F1217]">
        {/* Status indicator */}
        {isSidebarExpanded ? (
          <div className="flex items-center gap-[5px] h-8 px-4 text-[10px] text-[#52B788] select-none font-medium">
            <span className="w-[5px] h-[5px] rounded-full bg-[#52B788] animate-pulse" />
            <span>All systems operational</span>
          </div>
        ) : (
          <div className="flex justify-center h-8 items-center relative group">
            <span className="w-[5px] h-[5px] rounded-full bg-[#52B788]" />
            <div className="absolute left-[54px] z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-[#1A2030] border border-[#2A3347] rounded-[3px] py-1 px-2 text-[10px] text-[#52B788] shadow-lg whitespace-nowrap">
              All systems operational
            </div>
          </div>
        )}

        {/* Support Link */}
        <SidebarItem
          icon={HelpCircle}
          label="Support"
          active={false}
          onClick={() => window.open('https://vigilnet.ai/support', '_blank')}
          collapsed={!isSidebarExpanded}
        />
        {/* Settings Link */}
        <SidebarItem
          icon={Settings}
          label="Settings"
          active={activeTab === 'Settings'}
          onClick={() => setActiveTab('Settings')}
          collapsed={!isSidebarExpanded}
        />
      </div>
    </div>
  );
};
