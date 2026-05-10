import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/app/App";

describe("App shell", () => {
  it("enters the match3 easy mode with its easy config", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "开始规划主流程" }));
    await user.click(screen.getByRole("button", { name: "开心消消乐" }));
    await user.click(screen.getByRole("button", { name: "简单模式" }));

    expect(screen.getByRole("heading", { name: "开心消消乐 - 简单模式" })).toBeInTheDocument();
    expect(screen.getByText("棋盘大小：6 x 6")).toBeInTheDocument();
    expect(screen.getByText("元素种类：4 种")).toBeInTheDocument();
  });

  it("enters the match3 hard mode with its hard config", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "开始规划主流程" }));
    await user.click(screen.getByRole("button", { name: "开心消消乐" }));
    await user.click(screen.getByRole("button", { name: "困难模式" }));

    expect(screen.getByRole("heading", { name: "开心消消乐 - 困难模式" })).toBeInTheDocument();
    expect(screen.getByText("棋盘大小：7 x 7")).toBeInTheDocument();
    expect(screen.getByText("元素种类：5 种")).toBeInTheDocument();
    expect(screen.getByText("步数限制：14")).toBeInTheDocument();
  });
});
