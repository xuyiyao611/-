type HomePageProps = {
  onStart: () => void;
};

export function HomePage({ onStart }: HomePageProps) {
  return (
    <main className="page-shell">
      <section className="panel hero-panel">
        <p className="eyebrow">项目骨架已建立</p>
        <h1>消除大师</h1>
        <p className="lead">
          双玩法消除游戏基础框架。当前阶段为 P0，页面和场景切换骨架已可进入下一阶段。
        </p>
        <button className="primary-button" onClick={onStart} type="button">
          开始
        </button>
      </section>
    </main>
  );
}
