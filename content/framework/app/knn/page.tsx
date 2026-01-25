import type { Metadata } from "next";
import { ClientContent } from "./client";

export default function KNN() {
  return <ClientContent />;
}

export const metadata: Metadata = {
  title: "k-nearest neighbors",
};
