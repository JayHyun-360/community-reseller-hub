"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Product } from "@/lib/types";

const HISTORY_STATE_FLAG = "nearbytProductModal";

type ModalHistoryState = {
  [HISTORY_STATE_FLAG]?: boolean;
};

function isModalHistoryState(state: unknown): state is ModalHistoryState {
  return (
    typeof state === "object" &&
    state !== null &&
    HISTORY_STATE_FLAG in state &&
    (state as ModalHistoryState)[HISTORY_STATE_FLAG] === true
  );
}

/**
 * Pinterest-style product modal navigation: one overlay, internal product stack,
 * browser back / popstate synced when the user goes deeper via related tiles.
 */
export function useProductModalStack() {
  const [stack, setStack] = useState<Product[]>([]);
  const historyPushesRef = useRef(0);
  const skipPopCountRef = useRef(0);

  const product = stack.length > 0 ? stack[stack.length - 1] : null;
  const isOpen = product !== null;
  const canGoBack = stack.length > 1;

  const pushModalHistory = useCallback(() => {
    if (typeof window === "undefined") return;
    window.history.pushState(
      { [HISTORY_STATE_FLAG]: true },
      "",
      window.location.href,
    );
    historyPushesRef.current += 1;
  }, []);

  const open = useCallback(
    (next: Product) => {
      setStack([next]);
      historyPushesRef.current = 0;
      pushModalHistory();
    },
    [pushModalHistory],
  );

  const goToRelated = useCallback(
    (next: Product) => {
      setStack((prev) => {
        if (prev.length === 0) return [next];
        if (prev[prev.length - 1].id === next.id) return prev;
        return [...prev, next];
      });
      pushModalHistory();
    },
    [pushModalHistory],
  );

  const popStack = useCallback(() => {
    setStack((prev) => (prev.length <= 1 ? [] : prev.slice(0, -1)));
  }, []);

  const back = useCallback(() => {
    if (stack.length <= 1) return;
    if (typeof window === "undefined") {
      popStack();
      return;
    }
    window.history.back();
  }, [stack.length, popStack]);

  const close = useCallback(() => {
    const pops = historyPushesRef.current;
    setStack([]);
    historyPushesRef.current = 0;

    if (pops > 0 && typeof window !== "undefined") {
      skipPopCountRef.current += pops;
      window.history.go(-pops);
    }
  }, []);

  const setCurrentProduct = useCallback<
    Dispatch<SetStateAction<Product | null>>
  >((updater) => {
    setStack((prev) => {
      if (prev.length === 0) return prev;
      const current = prev[prev.length - 1];
      const next =
        typeof updater === "function" ? updater(current) : updater;
      if (!next) return prev;
      return [...prev.slice(0, -1), next];
    });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      if (skipPopCountRef.current > 0) {
        skipPopCountRef.current -= 1;
        return;
      }

      setStack((prev) => {
        if (prev.length <= 1) return [];
        return prev.slice(0, -1);
      });

      if (historyPushesRef.current > 0) {
        historyPushesRef.current -= 1;
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return {
    product,
    isOpen,
    canGoBack,
    open,
    goToRelated,
    back,
    close,
    setCurrentProduct,
  };
}

export { isModalHistoryState };
