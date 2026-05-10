import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/app/App";

describe("App shell", () => {
  it("shows the landing page first and can enter the cozy home", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole("button", { name: "Tap to Start" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "开新游戏" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tap to Start" }));

    expect(screen.getByRole("heading", { name: "角落消消" })).toBeInTheDocument();
    expect(screen.getByText("当前金币：10")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "角色图鉴" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "已兑换角色" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "暖心商店" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "开新游戏" }));
    expect(screen.getByRole("button", { name: "Tap to Start" })).toBeInTheDocument();
  });

  it("goes to difficulty selection and enters 角落消消 easy mode", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Tap to Start" }));
    await user.click(screen.getByRole("button", { name: "开始游戏" }));

    expect(screen.getByRole("heading", { name: "为 角落消消 选择难度" })).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "简单模式 目标分数更低，刷新白熊、鼹鼠、水龙、企鹅、幽灵、猫咪 6 类元素。",
      }),
    );

    expect(screen.getByRole("heading", { name: "角落消消 - 简单模式" })).toBeInTheDocument();
    expect(screen.getByText("棋盘大小：9 x 9")).toBeInTheDocument();
    expect(screen.getByText("本局元素：6 种")).toBeInTheDocument();
    expect(screen.getByText("兑换规则：200 碎片兑换 1 个角色")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "提示 -5 金币" })).toBeInTheDocument();
  });
});
