import React from 'react';

// Structural line icons drawn for this site (replaces the stock icon library).
// 24 x 24 grid, 1.6 stroke, round joins. Size and colour come from className.
type IconProps = React.SVGProps<SVGSVGElement>;

function make(children: React.ReactNode, displayName: string) {
  const Icon = React.forwardRef<SVGSVGElement, IconProps>(function Icon(props, ref) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        {children}
      </svg>
    );
  });
  Icon.displayName = displayName;
  return Icon;
}

const circle = <circle cx="12" cy="12" r="9" />;

export const Check = make(<path d="M5 12.5l4.5 4.5L19 7.5" />, 'Check');
export const X = make(<path d="M6 6l12 12M18 6L6 18" />, 'X');
export const ChevronRight = make(<path d="M9 5l7 7-7 7" />, 'ChevronRight');
export const ChevronLeft = make(<path d="M15 5l-7 7 7 7" />, 'ChevronLeft');
export const ChevronDown = make(<path d="M5 9l7 7 7-7" />, 'ChevronDown');
export const ChevronUp = make(<path d="M5 15l7-7 7 7" />, 'ChevronUp');
export const ArrowRight = make(<path d="M4 12h16M14 6l6 6-6 6" />, 'ArrowRight');
export const ArrowLeft = make(<path d="M20 12H4M10 6l-6 6 6 6" />, 'ArrowLeft');
export const CheckCircle2 = make(<><circle cx="12" cy="12" r="9" /><path d="M8 12.5l3 3 5-6" /></>, 'CheckCircle2');
export const AlertCircle = make(<><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5v.5" /></>, 'AlertCircle');
export const HelpCircle = make(<><circle cx="12" cy="12" r="9" /><path d="M9.6 9.6a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.2 1-1.2 1.8M12 17v.4" /></>, 'HelpCircle');
export const ShieldCheck = make(<><path d="M12 3l8 3v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>, 'ShieldCheck');
export const Truck = make(<><path d="M3 6h11v10H3zM14 9.5h4l3 3.5v3h-7" /><circle cx="7.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></>, 'Truck');
export const Wrench = make(<path d="M14.7 6.3a4.5 4.5 0 0 0 5.6 5.6l-8.9 8.9a2.1 2.1 0 0 1-3-3l8.9-8.9zM14.7 6.3L17 4l3 3-2.3 2.3" />, 'Wrench');
export const Clock = make(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, 'Clock');
export const Phone = make(<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />, 'Phone');
export const PhoneCall = make(<><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" /><path d="M15 4a5 5 0 0 1 5 5M15 7.5a1.5 1.5 0 0 1 1.5 1.5" /></>, 'PhoneCall');
export const Mail = make(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></>, 'Mail');
export const MapPin = make(<><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>, 'MapPin');
export const Bitcoin = make(<><circle cx="12" cy="12" r="9" /><path d="M10 8h3.4a2 2 0 0 1 0 4H10zM10 12h4a2 2 0 0 1 0 4h-4zM10 8v8M11.5 6.5V8M13.5 6.5V8M11.5 16v1.5M13.5 16v1.5" /></>, 'Bitcoin');
export const Award = make(<><circle cx="12" cy="9" r="5.5" /><path d="M9 14l-1 7 4-2 4 2-1-7" /></>, 'Award');
export const Users = make(<><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.4" /><path d="M16 14.2c3 .3 5 2.4 5 5.8" /></>, 'Users');
export const User = make(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></>, 'User');
export const ShoppingBag = make(<><path d="M5 8h14l-1 12H6z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>, 'ShoppingBag');
export const Send = make(<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" />, 'Send');
export const Search = make(<><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.4-4.4" /></>, 'Search');
export const RotateCcw = make(<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5" />, 'RotateCcw');
export const Map = make(<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14" />, 'Map');
export const Lock = make(<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>, 'Lock');
export const Home = make(<path d="M4 11l8-7 8 7M6 10v10h12V10" />, 'Home');
export const Globe = make(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>, 'Globe');
export const FileText = make(<path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6" />, 'FileText');
export const ExternalLink = make(<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />, 'ExternalLink');
export const Calendar = make(<><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M4 10h16M8 3v4M16 3v4" /></>, 'Calendar');
export const BookOpen = make(<path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3zM21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z" />, 'BookOpen');
export const Star = make(<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />, 'Star');
export const Gauge = make(<><path d="M4 17a9 9 0 1 1 16 0" /><path d="M12 14l4-5" /></>, 'Gauge');
export const Battery = make(<><rect x="3" y="8" width="16" height="9" rx="2" /><path d="M21 11v3M7 11.5v2M11 11.5v2" /></>, 'Battery');
export const Zap = make(<path d="M13 3L5 13h6l-1 8 8-10h-6z" />, 'Zap');
export const Filter = make(<path d="M4 5h16l-6 8v6l-4-2v-4z" />, 'Filter');
export const SlidersHorizontal = make(<path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M6 15v4" />, 'SlidersHorizontal');
export const Menu = make(<path d="M4 7h16M4 12h16M4 17h16" />, 'Menu');
export const Plus = make(<path d="M12 5v14M5 12h14" />, 'Plus');
export const Minus = make(<path d="M5 12h14" />, 'Minus');
export const Trash2 = make(<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />, 'Trash2');
export const Copy = make(<><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></>, 'Copy');
export const Info = make(<><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></>, 'Info');
export const Share2 = make(<><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" /></>, 'Share2');
export const Heart = make(<path d="M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.2 12 20 12 20z" />, 'Heart');
export const Package = make(<path d="M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8" />, 'Package');
export const CreditCard = make(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></>, 'CreditCard');
export const Eye = make(<><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>, 'Eye');
export const Tag = make(<><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1.2" /></>, 'Tag');
export const Smartphone = make(<><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 18h2" /></>, 'Smartphone');
export const Sparkles = make(<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />, 'Sparkles');
export const Loader2 = make(<path d="M12 3a9 9 0 1 0 9 9" />, 'Loader2');
export const CheckCircle = CheckCircle2;
export const ChevronsRight = make(<path d="M6 6l6 6-6 6M13 6l6 6-6 6" />, 'ChevronsRight');
export const Quote = make(<path d="M7 7h4v5H7zM13 7h4v5h-4zM7 12c0 3-1 4-3 5M13 12c0 3-1 4-3 5" />, 'Quote');
export const ThumbsUp = make(<path d="M8 11v9H4v-9zM8 11l4-8c2 0 3 1.5 2.5 3.5L14 9h5a2 2 0 0 1 2 2.4l-1.2 6A2 2 0 0 1 17.8 19H8" />, 'ThumbsUp');
export const Navigation = make(<path d="M12 3l8 18-8-4-8 4z" />, 'Navigation');
export const Cpu = make(<><rect x="6" y="6" width="12" height="12" rx="1.5" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /></>, 'Cpu');
export const Settings = make(<><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></>, 'Settings');
export const BatteryCharging = make(<><rect x="3" y="8" width="16" height="9" rx="2" /><path d="M21 11v3M11 9.5l-2.5 3H12l-2 3" /></>, 'BatteryCharging');
export const MessageSquare = make(<path d="M4 5h16v11H9l-5 4z" />, 'MessageSquare');
export const QrCode = make(<><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><path d="M14 14h2v2h-2zM18 14h2M14 18h2M18 18h2v2" /></>, 'QrCode');
export const RefreshCw = make(<path d="M20 11a8 8 0 0 0-14.5-3.5M4 4v4h4M4 13a8 8 0 0 0 14.5 3.5M20 20v-4h-4" />, 'RefreshCw');
export const ShieldAlert = make(<><path d="M12 3l8 3v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6z" /><path d="M12 8.5v4.5M12 16v.4" /></>, 'ShieldAlert');
