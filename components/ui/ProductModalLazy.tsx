"use client";

import dynamic from "next/dynamic";

export const ProductModal = dynamic(
  () => import("./ProductModal").then((m) => m.ProductModal),
  { ssr: false },
);
