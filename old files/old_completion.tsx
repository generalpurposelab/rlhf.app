// og completion file

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
import { TextArea, TextField, Flex, Text, Separator, Heading } from '@radix-ui/themes';
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

const hf = new HfInference('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');

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function DataTable() {
  const [input, setInput] = useState('');
  const [model, setModel] = useState('openai');
  const [isLoading, setIsLoading] = useState(false); 
  const [number, setNumber] = useState(3);
  const [outputs, setOutputs] = useState({}); 
  const [position, setPosition] = useState("Test data")
  const fileInputRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(prompts);
  }, []);
  
  const [promptIndex, setPromptIndex] = useState(0);
  const [selectedButton, setSelectedButton] = useState(null);

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

  const handleButtonClick = (index) => {
    setOutputs(prevOutputs => ({ ...prevOutputs, [promptIndex]: { ...prevOutputs[promptIndex], selected: index } }));
  };

  const downloadOutputs = () => {
    const processedOutputs = Object.keys(outputs).reduce((acc, key) => {
      const selectedOutput = outputs[key].selected;
      if (selectedOutput !== null && selectedOutput !== undefined) {
        acc[key] = {
          prompt: data[key].question,
          output: outputs[key][selectedOutput]
        };
      }
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
    setOutputs(prevOutputs => ({ ...prevOutputs, [promptIndex]: { results: [], selected: null } }));
    const results = [];
    for (let i = 0; i < number; i++) {
      const result = await hf.textGeneration({
        model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
        inputs: `<|prompter|>${data[promptIndex].question}<|endoftext|><|assistant|>`,
        parameters: {
          max_new_tokens: 200,
          typical_p: 0.2,
          repetition_penalty: 1,
          truncate: 1000,
          return_full_text: false,
        },
      });
      console.log(result.generated_text);
      results.push(result.generated_text);
    }

    setOutputs(prevOutputs => ({ ...prevOutputs, [promptIndex]: results }));
    setIsLoading(false); 
  };

  const fetchData2 = async () => {
    setIsLoading(true); // Set loading to true when fetching starts
    setOutputs(prevOutputs => ({ ...prevOutputs, [promptIndex]: { results: [], selected: null } }));
    let results = [];
  
    for (let i = 0; i < number; i++) {
      const result = await openai.chat.completions.create({
        messages: [{ role: "user", content: data[promptIndex].question }],
        model: "gpt-3.5-turbo",
      });
  
      results.push(result.choices[0].message.content);
    }
  
    setOutputs(prevOutputs => ({ ...prevOutputs, [promptIndex]: results }));
    setIsLoading(false); // Set loading to false when fetching ends
  };

  const handleTextAreaChange = (e, index) => {
    const newOutputs = { ...outputs };
    if (newOutputs[promptIndex]) {
      newOutputs[promptIndex][index] = e.target.value;
    }
    setOutputs(newOutputs);
  };

  return (
    <div>
      <Flex direction="row" justify="between" grow="1">
    <Heading>Translate completions</Heading>
    <Flex gap="3" >

      <Select onValueChange={value => setNumber(parseInt(value, 10))}>
        <SelectTrigger className="w-[150px]">
          <Flex justifyContent="flex-start" gap="3" align="center">
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
          <Flex justifyContent="flex-start" gap="3" align="center">
            <RocketIcon/>
            <SelectValue placeholder="gpt-3.5" />
          </Flex>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="openai">gpt-3.5</SelectItem>
          <SelectItem value="oss">oasst</SelectItem>
        
        </SelectContent>
      </Select>

      <input 
  ref={fileInputRef}
  type="file" 
  accept=".json" 
  style={{ display: 'none' }}
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          setData(json);
        } catch (error) {
          console.error('Error parsing JSON', error);
        }
      };
      reader.readAsText(file);
    }
  }} 
/>

<DropdownMenu>
<DropdownMenuTrigger asChild>
  <Button variant={data.length > 0 ? "outline" : "default"}>
    {(position === 'Test data' || position === 'Custom' || position === 'Local data') ? <Braces className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
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
          <DropdownMenuRadioItem value="Local data">
          <Cpu className="mr-2 h-4 w-4" />
            <span>Local data</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Custom" onSelect={() => fileInputRef.current.click()}>
          <PlusCircle className="mr-2 h-4 w-4" />
            <span>Custom data</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    <Button variant={data.length > 0 ? "default" : "outline"} disabled={outputs.length === 0} onClick={downloadOutputs}>
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
          value={outputs[promptIndex] ? outputs[promptIndex][index] || '' : ''} 
          onClick={() => handleButtonClick(index)}
          onChange={(e) => handleTextAreaChange(e, index)}
        />
        <Button 
            variant={outputs[promptIndex] && outputs[promptIndex].selected === index ? "destructive" : "outline"} 
            fullWidth 
            onClick={() => handleButtonClick(index)}
          >
          {outputs[promptIndex] && outputs[promptIndex].selected === index ? <CheckIcon className="mr-2"/> : <CursorArrowIcon className="mr-2"/>}
          Select
        </Button>
        </Flex>
      </>
    ))}

</Flex>
</Flex>
<Separator my="3" size="4" />

  <Flex direction="row" justify="between" grow="1" align="center">
         <Text>{promptIndex + 1}/{data.length}</Text>
          <Flex gap="3" align="center">
            Back

            <Button variant="secondary" size="icon" onClick={handlePreviousPage} disabled={promptIndex === 0}>
  <ChevronLeftIcon/>
</Button>
<Button variant="secondary" size="icon" onClick={handleNextPage} disabled={promptIndex === data.length - 1}>
  <ChevronRightIcon/>
</Button>

            Next
            <Button
  onClick={model === 'openai' ? fetchData2 : fetchData}
  disabled={isLoading}
>
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
    </div>
  )
}

export default DataTable