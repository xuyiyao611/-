import type { ReactNode } from "react";

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
    <main className="page-shell">
      <section className={`panel${hero ? " hero-panel" : ""}`}>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className={hero ? "hero-title" : "section-title"}>{title}</h1>
        {description ? <p className="lead">{description}</p> : null}
        {children}
      </section>
    </main>
  );
}
