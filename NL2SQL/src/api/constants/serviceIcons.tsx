export const ServiceIcons = {
  freshdesk: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3" width="20" height="18" rx="2" fill="#0066CC" />
      <rect x="4" y="6" width="16" height="2" fill="white" />
      <rect x="4" y="10" width="12" height="2" fill="white" />
      <rect x="4" y="14" width="8" height="2" fill="white" />
    </svg>
  ),
  apollo: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#311C87" />
      <path d="M12 7l3 5h-6l3-5z" fill="white" />
      <path d="M8 13h8l-1.5 3h-5L8 13z" fill="white" />
    </svg>
  ),
  pipedrive: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#1A1A1A" />
      <path d="M7 12h10M12 7v10" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="#00A86B" />
    </svg>
  ),
  ortto: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#FF6B35" />
      <circle cx="12" cy="12" r="6" fill="white" />
      <circle cx="12" cy="12" r="3" fill="#FF6B35" />
    </svg>
  ),
  default: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="15" rx="2" fill="#0078d4" />
      <rect x="5" y="7" width="14" height="2" fill="white" />
      <rect x="5" y="11" width="10" height="2" fill="white" />
      <rect x="5" y="15" width="6" height="2" fill="white" />
    </svg>
  )
} as const;

export type ServiceIconKey = keyof typeof ServiceIcons;