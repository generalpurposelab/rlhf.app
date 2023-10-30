import { Flex } from '@radix-ui/themes';
import { Button } from "@/components/ui/button"
import { ChatBubbleIcon, DashboardIcon, FontRomanIcon, GearIcon, InfoCircledIcon, MagicWandIcon, MagnifyingGlassIcon, PersonIcon, StarIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import Image from 'next/image'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

  type SidebarProps = {
    className?: string;
    highlightIcon?: string;
    highlightVariant?: "ghost" | "link" | "default" | "destructive" | "outline" | "secondary" | null | undefined;
  };

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

            <TooltipProvider>
              <Tooltip>
                  <TooltipTrigger>
                      <Link href="/prompts">
                          <Button variant={getVariant("Demonstration")} size="icon">
                              <FontRomanIcon/>
                          </Button>
                      </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                      <p>Translate prompts</p>
                  </TooltipContent>
              </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
              <Tooltip>
                  <TooltipTrigger>
                      <Link href="/completions">
                          <Button variant={getVariant("Comparison")} size="icon">
                              <DashboardIcon/>
                          </Button>
                      </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                      <p>Translate completions</p>
                  </TooltipContent>
              </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
              <Tooltip>
                  <TooltipTrigger>
                      
                          <Button variant={getVariant("Evaluation")} size="icon" disabled>
                              <StarIcon/>
                          </Button>
                 
                  </TooltipTrigger>
                  <TooltipContent side="right">
                      <p>Evaluate outputs</p>
                  </TooltipContent>
              </Tooltip>
          </TooltipProvider>

  

        

                <TooltipProvider>
              <Tooltip>
                  <TooltipTrigger>
                   
                          <Button variant={getVariant("Chat")} size="icon" disabled>
                          <ChatBubbleIcon/>
                          </Button>
                
                  </TooltipTrigger>
                  <TooltipContent side="right">
                      <p>Test models</p>
                  </TooltipContent>
              </Tooltip>
          </TooltipProvider>
              



            </Flex>

            <Flex gap="3" direction="column">

                <TooltipProvider>
              <Tooltip>
                  <TooltipTrigger>
                      <Link href="/info">
                          <Button variant={getVariant("Info")} size="icon">
                              <InfoCircledIcon/>
                          </Button>
                      </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                      <p>Instructions</p>
                  </TooltipContent>
              </Tooltip>
          </TooltipProvider>

           
                <Button variant={getVariant("Settings")} size="icon" disabled>
                    <GearIcon/>
                </Button>
              
            </Flex>
            </Flex>
       
       
        <div>
       
        </div>
    </div>
    </>
  )
}