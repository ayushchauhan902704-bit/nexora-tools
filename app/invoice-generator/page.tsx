import type { Metadata } from "next";
import InvoiceClient from "./InvoiceClient";

export const metadata: Metadata = {
  title: "Free Invoice Generator - Create Professional Invoice Online | THE NEXORA TOOLS",
  description: "Free Invoice Generator - GST Invoice banao, PDF download karo. Freelancer, Shop, Business ke liye 100% Free Professional Invoice Maker.",
};

export default function Page() {
  return <InvoiceClient />;
}
