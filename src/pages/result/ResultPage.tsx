import type { ResultPayload } from "@/shared/types/app";

type ResultPageProps = {
  result: ResultPayload | null;
  onRestart: () => void;
  onBackHome: () => void;
  onBackModeSelect: () => void;
};

export function ResultPage({
  result,
  onRestart,
  onBackHome,
  onBackModeSelect,
}: ResultPageProps) {
  return (
    <main className="page-shell">
      <section className="panel">
        <p className="eyebrow">P0 骨架页</p>
        <h2>{result?.title ?? "结果页"}</h2>
        <p className="lead">{result?.description ?? "当前结果信息为空。"}</p>
        <p className="hint-text">状态：{result?.status === "win" ? "胜利" : "失败"}</p>
        <div className="button-grid">
          <button className="primary-button" onClick={onRestart} type="button">
            重新开始
          </button>
          <button className="secondary-button" onClick={onBackModeSelect} type="button">
            返回玩法选择
          </button>
        </div>
        <button className="ghost-button" onClick={onBackHome} type="button">
          返回首页
        </button>
      </section>
    </main>
  );
}
