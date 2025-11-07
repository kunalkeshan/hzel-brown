import type { SVGProps } from "react";

export function RedditIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="11" r="1" fill="currentColor" />
      <circle cx="15" cy="11" r="1" fill="currentColor" />
      <path d="M9 15c.85.63 2.02 1 3 1s2.15-.37 3-1" />
      <path d="M18.5 10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
      <path d="M19 10l2-2" />
      <path d="M22 7l-1 1" />
    </svg>
  );
}
