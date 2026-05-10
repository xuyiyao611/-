import type { ReactNode } from "react";
import pageBackground from "@/assets/sumikko/page-background.jpg";

type PageFrameProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  hero?: boolean;
};

export function PageFrame({
  eyebrow,
  title,
  description,
  children,
  hero = false,
}: PageFrameProps) {
  return (
    <main
      className="page-shell page-shell-themed"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(255, 252, 247, 0.76), rgba(251, 248, 241, 0.9)), url(${pageBackground})`,
      }}
    >
      <section className={`panel${hero ? " hero-panel" : ""}`}>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className={hero ? "hero-title" : "section-title"}>{title}</h1>
        {description ? <p className="lead">{description}</p> : null}
        {children}
      </section>
    </main>
  );
}
