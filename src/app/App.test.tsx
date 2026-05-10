import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/app/App";

describe("App shell", () => {
  it("supports the P1 scene flow from home to game", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole("heading", { name: "消除大师" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "开始规划主流程" }));
    expect(screen.getByRole("heading", { name: "选择玩法" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "开心消消乐" }));
    expect(screen.getByRole("heading", { name: "为 开心消消乐 选择难度" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "简单模式" }));
    expect(screen.getByRole("heading", { name: "游戏场景容器" })).toBeInTheDocument();
    expect(screen.getByText("玩法：开心消消乐")).toBeInTheDocument();
  });

  it("supports the result flow and restart", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "开始规划主流程" }));
    await user.click(screen.getByRole("button", { name: "羊了个羊" }));
    await user.click(screen.getByRole("button", { name: "困难模式" }));
    await user.click(screen.getByRole("button", { name: "模拟失败" }));

    expect(screen.getByRole("heading", { name: "示例失败" })).toBeInTheDocument();
    expect(screen.getByText("结果：失败")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "重新开始当前模式" }));

    expect(screen.getByRole("heading", { name: "游戏场景容器" })).toBeInTheDocument();
    expect(screen.getByText("玩法：羊了个羊")).toBeInTheDocument();
  });
});
