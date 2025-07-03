import type { SVGProps } from "react";

export function ReasonVerseLogo(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
      <path d="M12 18V6" />
      <path d="M9.5 9.5c1.33-1.33 3.67-1.33 5 0" />
      <path d="M9.5 14.5c1.33 1.33 3.67 1.33 5 0" />
    </svg>
  );
}
