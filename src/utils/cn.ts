/**
 * Reusable utility function to merge Tailwind classes conditionally.
 * Mimics clsx and tailwind-merge in a lightweight format.
 */
export function cn(...inputs: (string | undefined | null | boolean | { [key: string]: boolean })[]) {
  return inputs
    .flatMap((input) => {
      if (!input) return [];
      if (typeof input === "string") return input.split(" ");
      if (typeof input === "object") {
        return Object.entries(input)
          .filter(([, value]) => value)
          .map(([key]) => key);
      }
      return [];
    })
    .filter(Boolean)
    .join(" ");
}
