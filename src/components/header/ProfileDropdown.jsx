import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { View, Text, Pressable } from 'react-native';
import { User, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ProfileDropdown = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const { theme, toggleTheme, colors } = useTheme();
  const isDark = theme === 'dark';

  const [profile, setProfile] = useState({
    displayName: 'Piyush Sodhi',
    email: 'piyush@example.com'
  });

  useEffect(() => {
    const loadProfile = () => {
      const saved = localStorage.getItem('user_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.displayName === 'Alexander Vogt') {
          parsed.displayName = 'Piyush Sodhi';
          parsed.email = 'piyush@example.com';
        }
        setProfile({
          displayName: parsed.displayName || 'Piyush Sodhi',
          email: parsed.email || 'piyush@example.com'
        });
      }
    };

    loadProfile();
    window.addEventListener('user_settings_changed', loadProfile);
    return () => window.removeEventListener('user_settings_changed', loadProfile);
  }, []);

  const menuItems = [
    { icon: User, label: 'My Profile', action: () => alert('Profile coming soon') },
    { icon: isDark ? Sun : Moon, label: `Theme: ${isDark ? 'Dark' : 'Light'}`, action: toggleTheme },
    { icon: LogOut, label: 'Logout', action: onLogout, danger: true },
  ];

  const nameToUse = profile.displayName || 'Piyush Sodhi';
  const initials = nameToUse.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <>
      {/* Trigger Button */}
      <Pressable
        ref={triggerRef}
        onPress={() => setIsOpen(!isOpen)}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: '#3B82F6',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        accessibilityLabel="User menu"
      >
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{initials}</Text>
      </Pressable>

      {/* Dropdown via Portal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 99998,
            }}
          />
          {/* Menu */}
          <div
            style={{
              position: 'fixed',
              top: (triggerRef.current?.getBoundingClientRect?.()?.bottom || 50) + 8,
              right: 16,
              zIndex: 99999,
              width: 260,
              backgroundColor: colors.surfaceElevated,
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              padding: 8,
              animation: 'dropdownFadeIn 0.15s ease-out',
            }}
          >
            {/* User Info */}
            <div style={{
              padding: '12px 16px',
              borderBottom: `1px solid ${colors.border}`,
              marginBottom: 8,
            }}>
              <div style={{ color: colors.textPrimary, fontWeight: 600, fontSize: 16 }}>{profile.displayName}</div>
              <div style={{ color: colors.textMuted, fontSize: 13 }}>{profile.email}</div>
            </div>

            {/* Menu Items */}
            {menuItems.map((item, i) => (
              <div
                key={i}
                onClick={() => { item.action(); setIsOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  color: item.danger ? colors.danger : colors.textSecondary,
                  fontSize: 14,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceHighlight}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </>,
        document.body
      )}
    </>
  );
};
