// app/app/page.tsx
import { Metadata } from "next";
import { NavigationBar } from "@/components/ui/navbar";
import { FAQ } from "@/components/ui/faq";
import { Banner } from "@/components/ui/banner";
import { Footer } from "@/components/ui/footer";

export const metadata: Metadata = {
  title: "RLHF.app - Demonstration",
  description: "Finetune LLMs in low resource languages.",
};

export default async function HomePage() {
  return (
    <div
      className="bg-white"
      style={{
        display: "block",
        flexDirection: "row",
        height: "100%",
        width: "100%",
        margin: "50px",
      }}
    >
      <NavigationBar />
      <Banner />

      <FAQ />
      <Footer />
    </div>
  );
}
