
import React from 'react';

export type Tab = 'monitor' | 'logging' | 'mirror' | 'ideas';

export interface NavItem {
  id: Tab;
  label: string;
  icon: React.ReactNode;
}

export interface Exercise {
  id: string;
  name: string;
  instructions?: string;
}

export interface CardioLogData {
  id: string;
  date: string;
  type: 'Esteira' | 'Bicicleta' | 'Elíptico' | 'Outro';
  distance?: number; // km
  time?: number; // minutes
  calories?: number;
}

export interface WeightLogData {
  id: string;
  date: string;
  weight: number; // kg
  bmi?: number;
}

export interface MeasurementLogData {
  id: string;
  date: string;
  type: 'Cintura' | 'Braço' | 'Coxa' | 'Peito' | 'Outro';
  value: number; // cm
}

export interface ProgressPhoto {
  id: string;
  date: string;
  imageUrl: string;
  notes?: string;
}

// Props for common components
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Gemini specific types
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  retrievedContext?: {
    uri: string;
    title: string;
  };
  // Add other possible chunk types if known
}

export interface GroundingMetadata {
  webSearchQueries?: string[];
  groundingChunks?: GroundingChunk[];
  searchEntryPoint?: {
    web?: Record<string, unknown>; // If structure is known, define it
  };
}
    