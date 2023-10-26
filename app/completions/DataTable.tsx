// new completion file
'use client'
import {
  Braces,
  Cpu,
  Download,
  FlaskConical,
  PlusCircle,
  Upload,
} from "lucide-react"
import OpenAI from "openai";
import { TextArea, TextField, Flex, Text, Code, Separator, Heading } from '@radix-ui/themes';
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from 'react';
import { Loader2 } from "lucide-react";
import { ChevronLeftIcon, ChevronRightIcon, CursorArrowIcon, DownloadIcon, CheckIcon, FontRomanIcon, RulerHorizontalIcon, Share1Icon, RocketIcon } from '@radix-ui/react-icons'
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

import { callOSS, callOpenai, callLlama, callMistral } from "@/lib/llms"
import { RiOpenaiFill } from 'react-icons/ri';
import { BsMeta } from 'react-icons/bs';

function DataTable() {
  const [input, setInput] = useState<string>('');
  const [model, setModel] = useState('openai');
  const [isLoading, setIsLoading] = useState(false); 
  const [number, setNumber] = useState(3);
  const [outputs, setOutputs] = useState<{ [key: number]: { selected: boolean; result: string; } }[]>([]);  const [position, setPosition] = useState("Test data")
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<{ question: string; answer: string; }[]>([]);

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
    setOutputs(prevOutputs => ({ 
      ...prevOutputs, 
      [promptIndex]: { 
        ...prevOutputs[promptIndex], 
        [index]: { 
          ...prevOutputs[promptIndex][index], 
          selected: true,
        } 
      } 
    }));
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

  const fetchData = async () => {
    setIsLoading(true);
    let results: string[] = [];
    const preprompt = "";
    
    if (model === 'openai') {
      results = await callOpenai(data, promptIndex, number, preprompt);
    } else if (model === 'oss') {
      results = await callOSS(data, promptIndex, number, preprompt);
    } else if (model === 'llama') {
      results = await callLlama(data, promptIndex, number, preprompt);
    } else if (model === 'mistral') {
      results = await callMistral(data, promptIndex, number, preprompt);
    }
    
    setOutputs(prevOutputs => ({ 
      ...prevOutputs, 
      [promptIndex]: results.map(result => ({ result, selected: false })) 
    }));
    setIsLoading(false);
  }

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {    
    const newOutputs = { ...outputs };
    if (newOutputs[promptIndex]) {
      newOutputs[promptIndex][index] = {
        ...newOutputs[promptIndex][index],
        result: e.target.value
      };
    }
    setOutputs(newOutputs);
  };

  return (
    <>
      <Flex direction="row" justify="between" grow="1">
        <Heading>Translate completions</Heading>
        <Flex gap="3" >

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

      <Select onValueChange={value => setModel(value)}>
        <SelectTrigger className="w-[150px]">
          <Flex justify="start" gap="3" align="center">
          {
              model === 'openai' ? <RiOpenaiFill/> :
              model === 'llama' ? <BsMeta/> :
              <RocketIcon/>
            }
            <SelectValue placeholder="gpt-3.5" />
          </Flex>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="openai">gpt-3.5</SelectItem>
          <SelectItem value="oss">oasst</SelectItem>
          <SelectItem value="llama">llama</SelectItem>
          <SelectItem value="mistral">mistral</SelectItem>
        </SelectContent>
      </Select>

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

<DropdownMenu>
<DropdownMenuTrigger asChild>
  <Button variant={data.length > 0 ? "outline" : "default"}>
    {(position === 'Test data' || position === 'Custom') ? <Braces className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
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
        <TextField.Input value={data[promptIndex]?.question} readOnly size="3" variant="soft"/>
      </TextField.Root>
  
      <Text size="2">Choose a response from the following and edit it until it is correct.</Text>

      <Flex grow="1" gap="3">
        
      {Array.from({ length: number }).map((_, index) => (
      <>
        <Flex gap="3" direction="column" style={{height: '100%', width: '100%'}} >
          
        <TextArea 
          key={index} 
          size="2"
          style={{height: '100%', width: '100%'}}
          value={
            outputs[promptIndex]
              ? typeof outputs[promptIndex][index] === 'object'
                ? outputs[promptIndex][index].result || ''
                : String(outputs[promptIndex][index]) || ''
              : ''
          }   
          onClick={() => handleButtonClick(index)}
          onChange={(e) => handleTextAreaChange(e, index)}
        />
      <Button 
          variant={outputs[promptIndex] && outputs[promptIndex][index] && outputs[promptIndex][index].selected ? "destructive" : "outline"} 
          fullWidth 
          onClick={() => handleButtonClick(index)}
      >
      {outputs[promptIndex] && outputs[promptIndex][index] && outputs[promptIndex][index].selected ? <CheckIcon className="mr-2"/> : <CursorArrowIcon className="mr-2"/>}
      Select
      </Button>
        </Flex>
      </>
    ))}

</Flex>
</Flex>
<Separator my="3" size="4" />

  <Flex direction="row" justify="between" grow="1" align="center">
         <Code>{promptIndex + 1}/{data.length}</Code>
          <Flex gap="3" align="center">
            Back

            <Button variant="secondary" size="icon" onClick={handlePreviousPage} disabled={promptIndex === 0}>
  <ChevronLeftIcon/>
</Button>
<Button variant="secondary" size="icon" onClick={handleNextPage} disabled={promptIndex === data.length - 1}>
  <ChevronRightIcon/>
</Button>

            Next
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
   </>
  );  
}

export default DataTable