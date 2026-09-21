import CounselorAvatar from "@/components/CounselorAvatar";
import type { ConsultStyle } from "@/lib/saju/types";

interface CounselorStyleCardProps {
  type: ConsultStyle;
  title: string;
  description: string;
  avatarSize?: "md" | "lg";
  titleClassName?: string;
  descriptionClassName?: string;
}

export default function CounselorStyleCard({
  type,
  title,
  description,
  avatarSize = "lg",
  titleClassName = "font-medium",
  descriptionClassName = "mt-1 text-sm text-ink-muted",
}: CounselorStyleCardProps) {
  return (
    <div className="flex items-center gap-4 text-left">
      <CounselorAvatar style={type} size={avatarSize} />
      <div className="min-w-0 flex-1">
        <h3 className={titleClassName}>{title}</h3>
        <p className={descriptionClassName}>{description}</p>
      </div>
    </div>
  );
}
