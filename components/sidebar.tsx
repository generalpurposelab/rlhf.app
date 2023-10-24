import { Flex } from '@radix-ui/themes';
import { Button } from "@/components/ui/button"
import { ChatBubbleIcon, DashboardIcon, FontRomanIcon, GearIcon, InfoCircledIcon, MagicWandIcon, MagnifyingGlassIcon, PersonIcon, StarIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import Image from 'next/image'
  
export function Sidebar({ highlightIcon = "Dashboard", highlightVariant = "ghost" }: SidebarProps) {

  const getVariant = (iconName: string) => {
    return highlightIcon === iconName ? highlightVariant : "ghost";
  }

  return (
    <>
        <div id="sidebar" className='h-screen px-3 py-5 flex flex-col justify-between border-r border-[#f2f2f2]'>
            
    
            <Flex direction="column" justify="between" grow="1">
                <Flex justify="center">
            <Link href="/" aria-label="Logo">
              <Image
                src="/favicon.svg"
                width={20}
                height={20}
                alt="RPRSNT logo"
              />
            </Link>
            </Flex>
            <Flex gap="3" direction="column">
          
                <Link href="/demonstration">
                <Button variant={getVariant("Demonstration")} size="icon">
                    <FontRomanIcon/>
                </Button>
                </Link>
                
                <Link href="/comparison">
                <Button variant={getVariant("Comparison")} size="icon">
                    <DashboardIcon/>
                </Button>
                </Link>
                
                <Link href="/evaluation">
                <Button variant={getVariant("Evaluation")} size="icon">
                    <StarIcon/>
                </Button>
                </Link>

                <Link href="/chat">
                <Button variant={getVariant("Chat")} size="icon">
                    <ChatBubbleIcon/>
                </Button>
                </Link>

                

            </Flex>
            <Flex gap="3" direction="column">
            <Link href="/info">
                <Button variant={getVariant("Info")} size="icon">
                    <InfoCircledIcon/>
                </Button>
                </Link>

                <Link href="/settings">
                <Button variant={getVariant("Settings")} size="icon">
                    <GearIcon/>
                </Button>
                </Link>
            </Flex>
            </Flex>
       
       
        <div>
       
        </div>
    </div>
    </>
  )
}