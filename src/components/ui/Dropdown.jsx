import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const Dropdown = ({ isOpen, onClose, triggerRef, children, style, position = 'bottom-right' }) => {
  const { colors } = useTheme();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (Platform.OS === 'web') {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;
  const rect = triggerRef?.current?.getBoundingClientRect?.() || { bottom: 0, left: 0, right: 0, width: 0 };
  const dropdownWidth = typeof style?.width === 'number' ? Math.min(style.width, window.innerWidth - 24) : Math.min(200, window.innerWidth - 24);

  let left = 'auto';
  let right = 'auto';
  let transform = 'none';

  if (position === 'bottom-right') {
    right = window.innerWidth - rect.right;
    if (window.innerWidth - right - dropdownWidth < 12) {
      left = 12;
      right = 'auto';
    } else {
      right = Math.max(12, right);
    }
  } else if (position === 'bottom-left') {
    left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 12) {
      right = 12;
      left = 'auto';
    } else {
      left = Math.max(12, left);
    }
  } else if (position === 'bottom-center') {
    left = rect.left + (rect.width / 2);
    transform = 'translateX(-50%)';
    const predictedLeft = left - (dropdownWidth / 2);
    if (predictedLeft < 12) {
      left = 12;
      transform = 'none';
    } else if (predictedLeft + dropdownWidth > window.innerWidth - 12) {
      right = 12;
      left = 'auto';
      transform = 'none';
    }
  }

  return createPortal(
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99998,
          backgroundColor: 'transparent',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: rect.bottom + 8,
          left,
          right,
          transform,
          zIndex: 99999,
          minWidth: 200,
          backgroundColor: colors.surfaceElevated,
          borderRadius: 8,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          animation: 'dropdownFadeIn 0.15s ease-out',
          ...style,
          width: dropdownWidth
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </>,
    document.body
  );
};
