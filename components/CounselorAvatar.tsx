import Image from "next/image";
import type { ConsultStyle } from "@/lib/saju/types";

interface CounselorAvatarProps {
  style: ConsultStyle;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = { sm: 40, md: 64, lg: 88 } as const;

const IMAGES: Record<ConsultStyle, { src: string; alt: string }> = {
  COLD: { src: "/counselors/cold.png", alt: "냉철한 상담가" },
  EMPATHETIC: { src: "/counselors/empathetic.png", alt: "공감형 상담가" },
};

export default function CounselorAvatar({ style, size = "md", className = "" }: CounselorAvatarProps) {
  const px = SIZES[size];
  const { src, alt } = IMAGES[style];

  return (
    <Image
      src={src}
      alt={alt}
      width={px}
      height={px}
      className={`shrink-0 rounded-full object-cover ring-2 ring-border-warm/80 ${className}`}
    />
  );
}
