import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/app/App";

describe("App shell", () => {
  it("shows home actions, collection progress, shop, and redeemed section", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByText("当前金币：10")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "角色介绍" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "已兑换角色" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "商店" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "开新游戏" }));
    expect(screen.getByText("当前金币：10")).toBeInTheDocument();
  });

  it("goes directly to difficulty selection and enters match3 easy mode", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "开始游戏" }));

    expect(screen.getByRole("heading", { name: "为 开心消消乐 选择难度" })).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "简单模式 目标分数更低，刷新白熊、鼹鼠、蜥蜴、企鹅、幽灵、猫咪 6 类元素。",
      }),
    );

    expect(screen.getByRole("heading", { name: "开心消消乐 - 简单模式" })).toBeInTheDocument();
    expect(screen.getByText("棋盘大小：9 x 9")).toBeInTheDocument();
    expect(screen.getByText("本局元素：6 种")).toBeInTheDocument();
    expect(screen.getByText("兑换规则：200 碎片兑换 1 个角色")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "提示 -5 金币" })).toBeInTheDocument();
  });
});
