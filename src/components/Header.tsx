import React from 'react';

interface HeaderProps {
  onAuthClick: () => void;
}

export function Header({ onAuthClick }: HeaderProps) {
  return null; // Header is now empty since all user-related UI is in the sidebar
}