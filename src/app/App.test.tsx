import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/app/App";

describe("App shell", () => {
  it("enters the match3 easy mode with a real board", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "开始规划主流程" }));
    await user.click(screen.getByRole("button", { name: "开心消消乐" }));
    await user.click(screen.getByRole("button", { name: "简单模式" }));

    expect(screen.getByRole("heading", { name: "开心消消乐 - 简单模式" })).toBeInTheDocument();
    expect(screen.getByText("棋盘生成")).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toBeGreaterThan(30);
  });

  it("allows selecting a match3 tile and updates the hint", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "开始规划主流程" }));
    await user.click(screen.getByRole("button", { name: "开心消消乐" }));
    await user.click(screen.getByRole("button", { name: "简单模式" }));

    const tiles = screen.getAllByRole("button").filter((button) =>
      button.className.includes("match3-tile"),
    );

    await user.click(tiles[0]);

    expect(screen.getByText("已选中一个方块，请选择相邻方块完成交换。")).toBeInTheDocument();
  });
});
