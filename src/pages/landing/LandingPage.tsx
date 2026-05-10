import landingBackground from "@/assets/sumikko/landing-background.jpg";

type LandingPageProps = {
  onStart: () => void;
  onNewGame: () => void;
};

export function LandingPage({ onStart, onNewGame }: LandingPageProps) {
  return (
    <main
      className="landing-shell"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(255, 251, 245, 0.16), rgba(255, 251, 245, 0.42)), url(${landingBackground})`,
      }}
    >
      <button
        aria-label="Tap to Start"
        className="landing-start"
        onClick={onStart}
        type="button"
      >
        <span className="landing-kicker">Cozy Match</span>
        <strong className="landing-title">角落消消</strong>
        <span className="landing-action">Tap to Start</span>
      </button>

      <button className="landing-reset" onClick={onNewGame} type="button">
        开新游戏
      </button>
    </main>
  );
}
