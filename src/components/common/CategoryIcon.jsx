import React from 'react';
import {
  Sparkles,
  Code2,
  Palette,
  Cloud,
  BookOpen,
  Share2,
  Star,
  Bookmark,
  Folder,
  Globe,
  Terminal,
  Cpu,
  Layers,
  Compass,
  FileCode,
  Layout,
  Wrench,
  Bot,
  Database,
  Shield,
  Zap,
} from 'lucide-react';

const ICON_MAP = {
  Sparkles,
  Code2,
  Palette,
  Cloud,
  BookOpen,
  Share2,
  Star,
  Bookmark,
  Folder,
  Globe,
  Terminal,
  Cpu,
  Layers,
  Compass,
  FileCode,
  Layout,
  Wrench,
  Bot,
  Database,
  Shield,
  Zap,
};

export default function CategoryIcon({ name, className = 'w-5 h-5' }) {
  const IconComponent = (name && ICON_MAP[name]) || Bookmark;
  return <IconComponent className={className} />;
}

