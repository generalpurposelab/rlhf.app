'use client'
// app/demonstration/DatasetTable.tsx
import { useState, useEffect, useRef } from 'react';
import { csv } from 'd3';
import { Input } from "@/components/ui/input"
import { Box, Flex, Heading, Separator, Text, TextArea, TextField } from '@radix-ui/themes';
import { Switch } from "@/components/ui/switch"
import { ChevronLeftIcon, ChevronRightIcon, CursorArrowIcon, DownloadIcon, FileTextIcon, FontRomanIcon, GlobeIcon, MagicWandIcon, PlusIcon, RulerHorizontalIcon } from '@radix-ui/react-icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useCompletion } from 'ai/react';
import ResponseBox from './responsebox';

export default function DataTable() {
  const [data, setData] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState("wikiqa");
  const [selectedSize, setSelectedSize] = useState(4);
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (index) => {
    setSelectedButton(index);
  };
  
  const [completions, setCompletions] = useState({});
  const currentIndex = useRef(0);

  const {
    complete,
    input,
    stop,
    isLoading,
    handleInputChange,
  } = useCompletion({
    api: '/api/completion',
    onFinish: (prompt, completion) => {
      console.log(`Prompt: ${prompt}, Completion: ${completion}`);
      setCompletions(prev => ({ ...prev, [prompt]: completion }));
      if (currentIndex.current < data.length - 1) {
        currentIndex.current += 1;
        complete(data[currentIndex.current].Prompt);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.length > 0) {
      currentIndex.current = 0;
      complete(data[0].Prompt);
    }
  };

  const handleInputChange2 = (e, prompt) => {
    const value = e.target.value;
    setCompletions(prev => ({ ...prev, [prompt]: value }));
  }

  const handleDownload = () => {
    
  };

  

  return (
    <>
          <form onSubmit={handleSubmit} style={{height: '100%'}}>

    <Flex direction="row" justify="between" grow="1">
    <Heading>Multiple choice</Heading>
    <Flex gap="3" >


<Select onValueChange={value => setSelectedSize(Number(value))}>
  <SelectTrigger className="w-[150px]">
  <Flex justifyContent="flex-start" gap="3" align="center">
    <RulerHorizontalIcon/>
    <SelectValue placeholder="4 samples" />
    </Flex>
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="2">2 samples</SelectItem>
    <SelectItem value="3">3 samples</SelectItem>
    <SelectItem value="4">4 samples</SelectItem>
    <SelectItem value="5">5 samples</SelectItem>
  </SelectContent>
</Select>


<Input 
  id="picture" 
  type="file" 
  accept=".json" 
  style={{ width: '250px' }}
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


<Button type="submit">
        Generate responses
      </Button>
      <Button onClick={handleDownload}>
  <DownloadIcon className="mr-2"/>Download
</Button>
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
  value={Object.values(data).length > 0 ? Object.values(data)[0] : "No dataset uploaded"} 
  size="3" 
  variant='soft' 
  disabled={!Object.values(data)[0]}
/>
  </TextField.Root>

  <Text size="2">Choose a response from the following and edit it until it is correct.</Text>
  <Flex gap="3" style={{height: '100%', flexGrow: 1}}>
  {
  Array.from({ length: selectedSize }).map((_, index) => (
    <ResponseBox 
      key={index} 
      onClick={() => handleButtonClick(index)} 
      isSelected={selectedButton === index}
    />
  ))
}
  </Flex>
  </Flex>
  
  <Separator my="3" size="4" />
  <Flex direction="row" justify="between" grow="1" align="center">
  <Text size="2">{data ? `${currentIndex.current + 1}/${Object.keys(data).length}` : "0/0"}</Text>
    <Flex gap="3" align="center">
      Back
      <Button variant="secondary" size="icon">
        <ChevronLeftIcon/>
      </Button>
      <Button variant="secondary" size="icon" disabled>
        <ChevronRightIcon/>
      </Button>
      Next
      </Flex>
  </Flex>
  

</form>
</>

  );
}