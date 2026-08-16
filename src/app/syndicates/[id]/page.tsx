import React from "react";
import { SyndicateDetailClient } from "./SyndicateDetailClient";

export function generateStaticParams() {
  return [
    { id: "syn-01" },
    { id: "syn-02" },
    { id: "syn-03" },
  ];
}

export default function SyndicateDetailPage() {
  return <SyndicateDetailClient />;
}
