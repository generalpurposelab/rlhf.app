// new completion file
'use client'
import {
  Braces,
  Database,
  Cpu,
  Download,
  FlaskConical,
  PlusCircle,
  Upload,
} from "lucide-react"
import OpenAI from "openai";
import { TextArea, TextField, Flex, Text, Code, Separator, Heading, Badge, Kbd, Link, Strong } from '@radix-ui/themes';
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from 'react';
import { Loader2 } from "lucide-react";
import { ChevronLeftIcon, ChevronRightIcon, CursorArrowIcon, QuestionMarkCircledIcon, CheckIcon, FontRomanIcon, RulerHorizontalIcon, Share1Icon, RocketIcon } from '@radix-ui/react-icons'
import { HfInference } from '@huggingface/inference'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import prompts from './prompts.json';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { callOSS, callOpenai, callLlama, callMistral } from "@/lib/llms"
import { RiOpenaiFill } from 'react-icons/ri';
import { BsMeta } from 'react-icons/bs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"


function DataTable() {
  const [input, setInput] = useState<string>('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [isLoading, setIsLoading] = useState(false); 
  const [number, setNumber] = useState(3);
  const [outputs, setOutputs] = useState<{ [key: number]: { selected: boolean; result: string; }[][] }>([]);  
  const [position, setPosition] = useState("Test data")
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<{ question: string; answer: string; }[]>([]);
  const { toast } = useToast()

  useEffect(() => {
    setData(prompts);
  }, []);
  
  const [promptIndex, setPromptIndex] = useState(0);
  
  const handlePreviousPage = () => {
    if (promptIndex > 0) {
      setPromptIndex(promptIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (promptIndex < data.length - 1) {
      setPromptIndex(promptIndex + 1);
    }
  };

  const handleButtonClick = (index: number) => {
    setOutputs(prevOutputs => {
      const newOutputs = { ...prevOutputs };
      if (newOutputs[promptIndex]) {
        newOutputs[promptIndex] = newOutputs[promptIndex].map((outputGroup, groupIndex) => {
          return outputGroup.map((output, outputIndex) => {
            if (groupIndex === 0 && outputIndex === index) {
              return {
                ...output,
                selected: true,
              };
            } else {
              return {
                ...output,
                selected: false,
              };
            }
          });
        });
      }
      return newOutputs;
    });
  };

  interface Output {
    prompt: string;
    output: string;
  }

  const downloadOutputs = () => {
    const processedOutputs = Object.keys(outputs).reduce<{ [key: string]: Output[] }>((acc, key) => {
      acc[key] = outputs[Number(key)].flat()
        .filter(output => output.selected)
        .map(output => ({
          prompt: data[Number(key)].question,
          output: output.result,
        }));
      return acc;
    }, {});
  
    const dataStr = JSON.stringify(processedOutputs);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.download = 'outputs.json';
    link.href = url;
    link.click();
  };

  const fetchData = async () => {
    setIsLoading(true);
    let results: string[] = [];
    const preprompt = "";
  
    try {
      if (model === 'gpt-3.5-turbo' || model === 'gpt-4') {
        results = await callOpenai(data, promptIndex, number, preprompt, model);
      } 
  
      setOutputs(prevOutputs => ({ 
        ...prevOutputs, 
        [promptIndex]: [results.map(result => ({ result, selected: false }))] 
      }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {    
    const newOutputs = { ...outputs };
    if (newOutputs[promptIndex]) {
      newOutputs[promptIndex][0][index] = {
        ...newOutputs[promptIndex][0][index],
        result: e.target.value
      };
    }
    setOutputs(newOutputs);
  };

  return (
    <>
      <Flex direction="row" justify="between" grow="1">
        <Flex>
        <Heading>Translate completions</Heading>

  <AlertDialog>
  <AlertDialogTrigger>
    <Button size="icon" variant="ghost" className='pb-1'>
      <QuestionMarkCircledIcon/>
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle style={{ marginBottom: '10px' }}>How to translate completions</AlertDialogTitle>
      <AlertDialogDescription>
      <Text style={{ color: 'black' }}>
  <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
  <li style={{ marginBottom: '10px' }}>If you have already used the app to translate prompts, they will appear here automatically. To add other data, click the <Kbd style={{ backgroundColor: '#f2f2f2', borderRadius: '5px' }}><Database className="mr-1 h-2 w-2" /> Dataset</Kbd> dropdown button to upload your own dataset (which should be in <Link weight="medium" underline="always" href="https://github.com/generalpurposelab/rlhf.app/blob/main/app/prompts/wikiqa.json">this format</Link>).</li>
  <li style={{ marginBottom: '10px' }}>Click the <Kbd style={{ backgroundColor: '#f2f2f2', borderRadius: '5px' }}><RulerHorizontalIcon className="mr-1 h-2 w-2" />samples</Kbd> dropdown at the top to choose how many samples you want to generate.</li>
    <li style={{ marginBottom: '10px' }}>Click the <Kbd style={{ backgroundColor: '#f2f2f2', borderRadius: '5px' }}>Generate</Kbd> button in the bottom right hand corner to generate translations.</li>
    <li style={{ marginBottom: '10px' }}>Choose the most accurate answer from the multiple answers provided, and then edit it so it is <b>truthful</b>, <b>harmless</b>, <b>culturally relevant</b>, and <b>helpful</b>. You can find further information on what this means by clicking the badges on the right of the page.</li>
    <li style={{ marginBottom: '10px' }}>Once you are happy with the answer, click <Kbd style={{ backgroundColor: '#f2f2f2', borderRadius: '5px' }}>Next</Kbd> to go to the next question and repeat these steps.</li>
    <li style={{ marginBottom: '10px' }}>Once you have finished, click <Kbd style={{ backgroundColor: '#f2f2f2', borderRadius: '5px' }}>Download</Kbd> to download them locally.</li>
  </ul>
</Text>

      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Close</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
</Flex>

        <Flex gap="3" >
        
        <div className='hidden lg:block sm:hidden'>
      <Select onValueChange={value => setNumber(parseInt(value, 10))}>
        <SelectTrigger className="w-[150px]">
          <Flex justify="start" gap="3" align="center">
          <RulerHorizontalIcon/>
            <SelectValue placeholder="3 samples" />
          </Flex>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2">2 samples</SelectItem>
          <SelectItem value="3">3 samples</SelectItem>
          <SelectItem value="4">4 samples</SelectItem>
        </SelectContent>
      </Select>
      </div>

{/* 
      <Select onValueChange={value => setModel(value)}>
        <SelectTrigger className="w-[150px]">
          <Flex justify="start" gap="3" align="center">
          {
              (model === 'gpt-3.5-turbo' || model === 'gpt-4') ? <RiOpenaiFill/> :
              model === 'llama' ? <BsMeta/> :
              <RocketIcon/>
            }
            <SelectValue placeholder="gpt-3.5" />
          </Flex>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gpt-3.5-turbo">gpt-3.5</SelectItem>
          <SelectItem value="gpt-4">gpt-4</SelectItem>
          <SelectItem value="llama">llama</SelectItem>
          <SelectItem value="mistral">mistral</SelectItem>
        </SelectContent>
      </Select>
      */}

      <input 
          ref={fileInputRef}
          type="file" 
          accept=".json" 
          style={{ display: 'none' }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {              
                  try {
                    if (event.target !== null && typeof event.target.result === 'string') {
                      const json = JSON.parse(event.target.result);
                      setData(json);
                    }
                  } catch (error) {
                    console.error('Error parsing JSON', error);
                  }
                };
                reader.readAsText(file);
              }
            }
          }}
        /> 

<div className='hidden lg:block sm:hidden'>
<DropdownMenu>
<DropdownMenuTrigger asChild>
  <Button variant="outline">
    <Database className="mr-2 h-4 w-4"/>
    <span>Dataset</span>
  </Button>
</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Choose source</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
        <DropdownMenuRadioItem value="Test data" onSelect={() => setData(prompts)}>
          <FlaskConical className="mr-2 h-4 w-4" />
            <span>Test data</span>
          </DropdownMenuRadioItem>
          
          <DropdownMenuRadioItem value="Custom" onSelect={() => fileInputRef.current?.click()}>
          <PlusCircle className="mr-2 h-4 w-4" />
            <span>Custom data</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>

    <Button 
  variant={Object.keys(outputs).length > 0 ? "default" : "outline"} 
  disabled={Object.keys(outputs).length === 0} 
  onClick={downloadOutputs}
>
  <Download className="mr-2 h-4 w-4" />
  <span>Download</span>
</Button>


{/* <Button onClick={() => { setOutputs(prevOutputs => ({ ...prevOutputs, [promptIndex]: { results: [], selected: null } })) }}>Clear</Button> */}

    </Flex>
  </Flex>
  <Separator my="3" size="4" />
  <Flex gap="3" direction="column" style={{height: '80vh', flexGrow: 1}}>
  <Heading size="4">Prompt</Heading>

  <TextField.Root>
    <TextField.Slot>
        <FontRomanIcon height="16" width="16" />
    </TextField.Slot>
    <TextField.Input 
        value={data[promptIndex]?.question} 
        size="3" 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const newData = [...data];
            if (newData[promptIndex]) {
                newData[promptIndex].question = e.target.value;
            }
            setData(newData);
        }}
    />
</TextField.Root>
        <Flex justify="between" align="center">
      <Text size="2">Choose a response from the following and edit it until it is correct, ensuring it is:</Text>
      <Flex gap="3">
     

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
          <Badge color="orange">Truthful</Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" style={{ textAlign: 'center' }}>
            <ul>
              <li>Ensure the information in the answer is</li>
              <li><b>correct and not misleading</b> and avoid</li>
              <li>sharing <b>false info or unverified claims</b></li>
              
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
          <Badge color="blue">Harmless</Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" style={{ textAlign: 'center' }}>
            <ul>
              <li>The answer should not cause any <b>harm or discomfort</b>.</li>
              <li>Be <b>kind, respectful, and fair</b> when referring to individuals</li>
              <li>or groups of people. Stay away from <b>abusive language,</b></li>
              <li><b>threats, or promoting violence</b> and don’t provide <b>dangerous</b></li>
              <li><b>or illegal advice</b>.</li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
          <Badge color="green">Culturally relevant</Badge> 
          </TooltipTrigger>
          <TooltipContent side="bottom" style={{ textAlign: 'center' }}>
            <ul>
              <li>Use the <b>dialect and way of speaking</b> that matches</li>
              <li>local context. Follow <b>cultural and ethical norms</b>. Be</li>
              <li>careful about <b>historical events, taboos, and sensitive</b></li>
              <li><b>topics</b>. Provide <b>inclusive and diverse representations</b>.</li>
              <li>Avoid <b>stereotypes and assumptions</b> about a particular</li>
              <li>culture or group of people.</li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>



      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
          <Badge color="crimson">Helpful</Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" style={{ textAlign: 'center' }}>
            <ul>
              <li>Try to answer what the user intended to ask, even if their</li>
              <li>question is vague. Write in <b>simple and understandable</b></li>
              <li>language. <b>Don’t just repeat</b> what the user has already said.</li>
              <li>If a direction seems unclear, ask the user for more details,</li>
              <li>explaining why you need more info. <b>Don’t assume</b> things that</li>
              <li>the user didn't mention, except for general knowledge.</li>               
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      </Flex>
      </Flex>

      <Flex grow="1" gap="3">
        
      {Array.from({ length: number }).map((_, index) => (
      <>
        <Flex gap="3" direction="column" style={{height: '100%', width: '100%'}} >
          
        <TextArea 
  key={index} 
  size="2"
  style={{height: '100%', width: '100%'}}
  value={
    outputs[promptIndex] && outputs[promptIndex][0][index]
      ? outputs[promptIndex][0][index].result || ''
      : ''
  }   
  onClick={() => handleButtonClick(index)}
  onChange={(e) => handleTextAreaChange(e, index)}
  disabled={!outputs[promptIndex] || !outputs[promptIndex][0][index]}
/>

<Button 
  variant={outputs[promptIndex] && outputs[promptIndex][0] && outputs[promptIndex][0][index] && outputs[promptIndex][0][index].selected ? "destructive" : "outline"} 
  fullWidth 
  onClick={() => handleButtonClick(index)}
>
  {outputs[promptIndex] && outputs[promptIndex][0] && outputs[promptIndex][0][index] && outputs[promptIndex][0][index].selected ? 
    <CheckIcon className="mr-2"/> : 
    <CursorArrowIcon className="mr-2" color={outputs[promptIndex] && outputs[promptIndex][0] && outputs[promptIndex][0][index] && outputs[promptIndex][0][index].selected ? "red" : "black"}/>
  }
  Select
</Button>

        </Flex>
      </>
    ))}

</Flex>
</Flex>
<Flex direction="column" className="fixed inset-x-22 bottom-0 bg-white w-full pr-24 pb-3">

<Separator my="3" size="4" />

<Flex direction="row" justify="between" grow="1" align="center">
  <Code>{promptIndex + 1}/{data.length}</Code>
  <Flex gap="3" align="center">
    Back
    <Button 
      variant="secondary" 
      size="icon" 
      onClick={handlePreviousPage} 
      disabled={promptIndex === 0}
    >
      <ChevronLeftIcon/>
    </Button>
    <Button 
      variant="secondary" 
      size="icon" 
      onClick={handleNextPage} 
      disabled={promptIndex === data.length - 1}
    >
      <ChevronRightIcon/>
    </Button>
    Next
    {/* 
    <Button 
      className="bg-[#E5484D]"
      onClick={() => {
        setData(data.filter((_, index) => index !== promptIndex));
        if (promptIndex >= data.length - 1) {
          setPromptIndex(data.length - 2);
        }
      }}
    >
      Delete
    </Button>
    */}

    <Button onClick={fetchData} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        <>
          Generate
        </>
      )}
    </Button>
  </Flex>
</Flex>
</Flex>
</>
);
}

export default DataTable