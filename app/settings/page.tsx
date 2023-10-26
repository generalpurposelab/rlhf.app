// app/app/page.tsx
import { Sidebar } from "@/components/sidebar"
import { Metadata } from "next"
import { Box} from '@radix-ui/themes';
import DataTable from './DataTable'

export const metadata: Metadata = {
  title: "RLHF.app - Demonstration",
  description: "Finetune LLMs in low resource languages.",
}

export default async function HomePage() {
 
  return (
    <div className='bg-white' style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%' }}>
  <Sidebar className="sidebar" highlightIcon="Settings" highlightVariant="outline"/>
  <Box grow="1" p="3">
    <DataTable/>
  </Box>
  
      </div>

  )
}
