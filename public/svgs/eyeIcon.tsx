export function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12s3.5-6 9.75-6 9.75 6 9.75 6-3.5 6-9.75 6-9.75-6-9.75-6Z"
      />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export function EyeOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3 3 18 18"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.58 10.58a2 2 0 0 0 2.83 2.83"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.88 5.09A10.8 10.8 0 0 1 12 4.75c6.25 0 9.75 7.25 9.75 7.25a17.8 17.8 0 0 1-3.12 3.89M6.61 6.61C3.96 8.4 2.25 12 2.25 12s3.5 7.25 9.75 7.25a10.8 10.8 0 0 0 4.12-.82"
      />
    </svg>
  );
}