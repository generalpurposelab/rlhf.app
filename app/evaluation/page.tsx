// app/app/page.tsx
import { redirect } from 'next/navigation';
import { Sidebar } from "@/components/sidebar"

import { Metadata } from "next"
import Image from "next/image"



export const metadata: Metadata = {
  title: "RLHF.app - Evaluation",
  description: "Finetune LLMs in low resource languages.",
}


export default async function HomePage() {
 
  return (
    <div className='bg-white' style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%' }}>
  <Sidebar className="sidebar" highlightIcon="Evaluation" highlightVariant="outline"/>
  
      </div>

  )
}
