type P = { size?: number; className?: string };
const base = (size = 20) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true });

export const BagIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M6 7h12l1 13H5L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
);
export const MenuIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const CloseIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const StarIcon = ({ size = 14, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor"><path d="m12 2 3 6.6 7 .8-5.2 4.8 1.5 7L12 17.8 5.7 21.2l1.5-7L2 9.4l7-.8L12 2Z" /></svg>
);
export const SparkIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></svg>
);
export const ShieldIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const TruckIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></svg>
);
export const RefreshIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M20 11a8 8 0 0 0-14.9-3M4 13a8 8 0 0 0 14.9 3" /><path d="M5 3v5h5M19 21v-5h-5" /></svg>
);
export const GemIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M6 3h12l3 6-9 12L3 9l3-6Z" /><path d="M3 9h18M9 3l3 18 3-18" /></svg>
);
export const ChatIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" /><path d="M8.5 11h.01M12 11h.01M15.5 11h.01" /></svg>
);
export const SendIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M4 12 20 4l-6 16-3-7-7-1Z" /></svg>
);
export const WhatsAppIcon = ({ size = 22, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden fill="currentColor">
    <path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.5.7 4.9 2 6.9L3 29l6.7-2.2c2 1.1 4.1 1.6 6.3 1.6 7 0 12.7-5.7 12.7-12.7S23 3 16 3Zm0 23.1c-2 0-4-.6-5.7-1.7l-.4-.2-4 1.3 1.3-3.9-.3-.4a10.4 10.4 0 0 1-1.6-5.6C5.3 9.9 10.1 5.2 16 5.2s10.5 4.7 10.5 10.5S21.8 26.1 16 26.1Zm5.8-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.6 8.6 0 0 1-4.3-3.7c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.1 2.2.9 3 1 4.1.8.7-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z" />
  </svg>
);
