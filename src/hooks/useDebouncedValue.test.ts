import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebouncedValue } from "./useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the latest value only after the delay", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: "a" } },
    );

    expect(result.current).toBe("a");

    rerender({ value: "ab" });
    rerender({ value: "abc" });
    expect(result.current).toBe("a");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(299);
    });
    expect(result.current).toBe("a");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(result.current).toBe("abc");
  });
});
