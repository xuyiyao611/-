import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/app/App";

describe("App shell", () => {
  it("supports the P2 scene flow and passes mode info into the game host", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole("heading", { name: "消除大师" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "开始规划主流程" }));
    await user.click(screen.getByRole("button", { name: "开心消消乐" }));
    await user.click(screen.getByRole("button", { name: "简单模式" }));

    expect(screen.getByRole("heading", { name: "游戏场景容器" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "开心消消乐 - 简单模式" })).toBeInTheDocument();
    expect(screen.getByText(/运行编号：#1/)).toBeInTheDocument();
  });

  it("supports restart and increments the game session run id", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "开始规划主流程" }));
    await user.click(screen.getByRole("button", { name: "羊了个羊" }));
    await user.click(screen.getByRole("button", { name: "困难模式" }));
    await user.click(screen.getByRole("button", { name: "模拟失败本局" }));

    expect(screen.getByRole("heading", { name: "羊了个羊示例失败" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "重新开始当前模式" }));

    expect(screen.getByRole("heading", { name: "羊了个羊 - 困难模式" })).toBeInTheDocument();
    expect(screen.getByText(/运行编号：#2/)).toBeInTheDocument();
  });
});
