import { useEffect, useRef, useState } from "react";

type CoinCounterProps = {
  value: number;
  label?: string;
  emphasize?: boolean;
};

export function CoinCounter({
  value,
  label = "当前金币",
  emphasize = false,
}: CoinCounterProps) {
  const previousValueRef = useRef(value);
  const [delta, setDelta] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const change = value - previousValueRef.current;

    if (change !== 0) {
      setDelta(change);
      setVisible(true);
      previousValueRef.current = value;

      const timer = window.setTimeout(() => {
        setVisible(false);
      }, 1200);

      return () => {
        window.clearTimeout(timer);
      };
    }

    previousValueRef.current = value;
    return undefined;
  }, [value]);

  return (
    <span className={`coin-counter${emphasize ? " coin-counter-strong" : ""}`}>
      {label}：{value}
      {delta !== null && visible ? (
        <span className={`coin-delta${delta > 0 ? " coin-delta-up" : " coin-delta-down"}`}>
          {delta > 0 ? `+${delta}` : delta}
        </span>
      ) : null}
    </span>
  );
}
