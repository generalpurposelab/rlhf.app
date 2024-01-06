// app/app/page.tsx
import { redirect } from "next/navigation";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finetune LLMs in low resource languages",
  description: "Finetune LLMs in low resource languages.",
};

export default async function HomePage() {
  // Redirect users to /prompts
  redirect("/home");
}
