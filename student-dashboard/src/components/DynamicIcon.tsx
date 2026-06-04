import React from "react";
import * as Icons from "lucide-react";

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function DynamicIcon({ name, className, size }: DynamicIconProps) {
  // Resolve components dynamically from lucide-react with safe fallback
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;

  return <IconComponent className={className} size={size} />;
}
