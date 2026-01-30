import Image from "next/image";

type BrandLogoProps = {
  size?: number;
  className?: string;
  wrapperClassName?: string;
  withLightModeBg?: boolean;
};

export function BrandLogo({
  size = 40,
  className,
  wrapperClassName,
  withLightModeBg = true,
}: BrandLogoProps) {
  const wrapperClasses = [
    "flex items-center justify-center",
    withLightModeBg
      ? "rounded-lg bg-brand-primary/90 p-1 dark:bg-transparent"
      : "",
    wrapperClassName ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  const imageClasses = ["object-contain", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses} style={{ width: size, height: size }}>
      <Image
        src="/logo-dark.png"
        alt="AND Offer Logo"
        width={size}
        height={size}
        className={["block", imageClasses, "dark:hidden"]
          .filter(Boolean)
          .join(" ")}
        priority
      />
      <Image
        src="/logo.png"
        alt="AND Offer Logo"
        width={size}
        height={size}
        className={["hidden", imageClasses, "dark:block"]
          .filter(Boolean)
          .join(" ")}
        priority
      />
    </div>
  );
}
