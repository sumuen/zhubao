import { ChevronRight, type LucideIcon } from "lucide-react";

type ActionLinkProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
};

export function ActionLink({
  icon: Icon,
  title,
  description,
  href,
}: ActionLinkProps) {
  return (
    <a className="action-link" href={href}>
      <span className="action-link__icon" aria-hidden="true">
        <Icon size={24} strokeWidth={2.2} />
      </span>
      <span className="action-link__copy">
        <span className="action-link__title">{title}</span>
        <span className="action-link__description">{description}</span>
      </span>
      <span className="action-link__arrow" aria-hidden="true">
        <ChevronRight size={19} strokeWidth={2.6} />
      </span>
    </a>
  );
}
