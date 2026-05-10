import { PageFrame } from "@/components/PageFrame";
import type { ResultPayload } from "@/shared/types/app";

type ResultPageProps = {
  result: ResultPayload;
  summary: string;
  onRestart: () => void;
  onBackHome: () => void;
  onBackModeSelect: () => void;
  onBackDifficultySelect: () => void;
};

export function ResultPage({
  result,
  summary,
  onRestart,
  onBackHome,
  onBackModeSelect,
  onBackDifficultySelect,
}: ResultPageProps) {
  return (
    <PageFrame
      eyebrow="P1 结果容器"
      title={result.title}
      description={result.description}
    >
      <div className={`result-banner${result.status === "win" ? " result-win" : " result-lose"}`}>
        <strong>{result.status === "win" ? "结果：胜利" : "结果：失败"}</strong>
        <span>{summary}</span>
      </div>

      <div className="button-grid">
        <button className="primary-button" onClick={onRestart} type="button">
          重新开始当前模式
        </button>
        <button className="secondary-button" onClick={onBackDifficultySelect} type="button">
          返回难度选择
        </button>
        <button className="secondary-button" onClick={onBackModeSelect} type="button">
          返回玩法选择
        </button>
      </div>

      <div className="button-row">
        <button className="ghost-button" onClick={onBackHome} type="button">
          返回首页
        </button>
      </div>
    </PageFrame>
  );
}
