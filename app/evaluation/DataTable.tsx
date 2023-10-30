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
import { TextArea, TextField, Flex, Text, Code, Separator, Heading, Badge } from '@radix-ui/themes';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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

function DataTable() {
  const [input, setInput] = useState<string>('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [isLoading, setIsLoading] = useState(false); 
  const [number, setNumber] = useState(3);
  const [outputs, setOutputs] = useState<{ [key: number]: { selected: number; result: string; } }[]>([]); 
  const [position, setPosition] = useState("Test data")
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<{ question: string; answer: string[]; }[]>([]);

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
      if (!newOutputs[promptIndex]) {
        newOutputs[promptIndex] = {};
      }
      for (let i = 0; i < number; i++) {
        newOutputs[promptIndex][i] = {
          ...(newOutputs[promptIndex][i] || {}),
          selected: i === index ? 1 : 0,
        };
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
      acc[key] = Object.entries(outputs[Number(key)])
        .filter(([_, output]) => output.selected)
        .map(([index, output]) => ({
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

  {/* const fetchData = async () => {
    setIsLoading(true);
    let results: string[] = [];
    const preprompt = "";
    
    if (model === 'gpt-3.5-turbo' || model === 'gpt-4') {
      results = await callOpenai(data, promptIndex, number, preprompt, model);
    } else if (model === 'oss') {
    
    setOutputs(prevOutputs => ({ 
      ...prevOutputs, 
      [promptIndex]: results.map(result => ({ result, selected: false })) 
    }));
    setIsLoading(false);
  } */}

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {    
    const newData = [...data];
    if (newData[promptIndex]) {
      newData[promptIndex].answer[index] = e.target.value;
    }
    setData(newData);
  };

  return (
    <>
      <Flex direction="row" justify="between" grow="1">
        <Flex>
        <Heading>Evaluate outputs</Heading>

  <AlertDialog>
  <AlertDialogTrigger>
    <Button size="icon" variant="ghost" className='pb-1'>
      <QuestionMarkCircledIcon/>
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>How to evaluate outputs</AlertDialogTitle>
      <AlertDialogDescription>
       Instructions go here.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Close</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
</Flex>

        <Flex gap="3" >
        
        {/* 
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
      */}

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
    <span>{data.length > 0 ? position : "Load data"}</span>
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
        <Flex justify="between" >
      <Text size="2">Rank the responses and edit the top ranked one until it is correct.</Text>
      <Flex gap="3">
      <Text size="2">Ensure your answer is:</Text>



      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
          <Badge color="orange">Helpful</Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>An answer that is helpful is ...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
          <Badge color="blue">Harmless</Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>An answer that is harmless is ...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
          <Badge color="green">Honest</Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>An answer that is honest is ...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
          <Badge color="cyan">Factual</Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>An answer that is factual is ...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
          <Badge color="crimson">Culturally relevant</Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>An answer that is culturally relevant is ..</p>
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
    data[promptIndex] && data[promptIndex].answer
      ? data[promptIndex].answer[index] || ''
      : ''
  }   
  onClick={() => handleButtonClick(index)}
  onChange={(e) => handleTextAreaChange(e, index)}
/>

<RadioGroup 
  defaultValue={outputs[promptIndex] && outputs[promptIndex][index] && outputs[promptIndex][index].selected.toString()} 
  onValueChange={() => handleButtonClick(index)}
>
  <Flex gap="2" direction="column">
    {Array.from({ length: 3 }).map((_, rank) => (
      <Text as="label" size="2" key={rank}>
        <Flex gap="2">
          <RadioGroupItem value={rank.toString()} />
          Rank {rank + 1}
        </Flex>
      </Text>
    ))}
  </Flex>
</RadioGroup>
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
    */}

    
  </Flex>
</Flex>
</Flex>
</>
);
}

export default DataTable