import type { Metadata } from "next";

import { ClientContent } from "./client";

export default function GraphAudiation() {
  return <ClientContent />;
}

export const metadata: Metadata = {
  title: "Graph audiation",
};
