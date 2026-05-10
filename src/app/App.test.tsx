import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/app/App";

describe("App shell", () => {
  it("supports the base scene flow in P0", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole("heading", { name: "消除大师" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "开始" }));
    expect(screen.getByRole("heading", { name: "选择玩法" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "开心消消乐" }));
    expect(screen.getByRole("heading", { name: "选择难度" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "简单模式" }));
    expect(screen.getByRole("heading", { name: "游戏场景容器" })).toBeInTheDocument();
  });
});
