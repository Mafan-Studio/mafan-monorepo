// Line icons for the five "How it works" steps, in step order.

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg
    width={28}
    height={28}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const PhotoIcon = () => (
  <Icon>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="m21 16-5-5-8 8" />
  </Icon>
);

const CubeIcon = () => (
  <Icon>
    <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
    <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
  </Icon>
);

const SparklesIcon = () => (
  <Icon>
    <path d="M10 4.5 11.6 9l4.4 1.5-4.4 1.6L10 16.5l-1.6-4.4L4 10.5 8.4 9z" />
    <path d="M18 3v3M16.5 4.5h3M17.5 15.5v4M15.5 17.5h4" />
  </Icon>
);

const BrushIcon = () => (
  <Icon>
    <path d="M14.5 4.5 19.5 9.5 12 17l-5-5z" />
    <path d="M7 12c-2.2 0-3.5 1.6-3.5 3.6 0 1.6-.6 2.6-1.5 3.4 3.6.6 7.5-.4 8-4z" />
  </Icon>
);

const GiftIcon = () => (
  <Icon>
    <rect x="3.5" y="8" width="17" height="4" rx="1" />
    <path d="M5 12v8h14v-8M12 8v12" />
    <path d="M12 8c-1.5-3.5-5.5-4-5.5-1.5S10 8 12 8zM12 8c1.5-3.5 5.5-4 5.5-1.5S14 8 12 8z" />
  </Icon>
);

export const STEP_ICONS = [
  PhotoIcon,
  CubeIcon,
  SparklesIcon,
  BrushIcon,
  GiftIcon,
] as const;

export const ClockIcon = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
