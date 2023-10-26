'use client'
// app/demonstration/DatasetTable.tsx
import { useState, useEffect, useRef } from 'react';
import wikiqa from './wikiqa.json';
import squad from './squad.json';
import { Input } from "@/components/ui/input"
import { Flex, Heading, Separator, Table, Code, Text } from '@radix-ui/themes';
import { Switch } from "@/components/ui/switch"
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, RocketIcon, FileTextIcon, GlobeIcon, MagicWandIcon, PlusIcon, RulerHorizontalIcon } from '@radix-ui/react-icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useCompletion } from 'ai/react';
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
import Link from 'next/link';
import { callOSS, callOpenai } from "@/lib/llms"
import {
  Braces,
  Cpu,
  Download,
  FlaskConical,
  PlusCircle,
  Upload,
  Loader2,
} from "lucide-react"

export default function DataTable() {
  
  const [data, setData] = useState<any[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>("wikiqa");
  const [language, setLanguage] = useState<string>("welsh");
  const [selectedSize, setSelectedSize] = useState<number>(10);
  const [completions, setCompletions] = useState<Record<string, any>>({});
  const [promptIndex, setPromptIndex] = useState<number>(0);
  const [checkedCount, setCheckedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [model, setModel] = useState<string>('openai');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const handleSwitchChange = (checked: boolean) => {
    setCheckedCount(prevCount => checked ? prevCount + 1 : prevCount - 1);
  }

  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
  
    for (let i = 0; i < selectedSize; i++) {
      let results: string[] = [];
      const preprompt = `Translate the following into ${language}:`;
  
      if (model === 'openai') {
        results = await callOpenai(data, i, 1, preprompt);
      } else {
        results = await callOSS(data, i, 1, preprompt);
      }
  
      setCompletions(prev => ({ ...prev, [data[i].question]: results[0] }));
    }
  
    setIsLoading(false);
  };

  const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement>, prompt: string) => {
    const value = e.target.value;
    setCompletions(prev => ({ ...prev, [prompt]: value }));
  }

  const handleDownload = () => {
    const dataArr = Object.values(completions).map(answer => ({ question: answer }));
    const dataStr = JSON.stringify(dataArr);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.download = 'prompts.json';
    link.href = url;
    link.click();
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(selectedSize / itemsPerPage)));
  };

  const handleBack = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    if (selectedDataset === 'wikiqa') {
      setData(wikiqa);
    } else if (selectedDataset === 'squad') {
      setData(squad);
    }
  }, [selectedDataset]);

  useEffect(() => {
    if (checkedCount === selectedSize) {
      setOpen(true);
    }
  }, [checkedCount, selectedSize]);



  return (
    <>
     

    <Flex direction="row" justify="between" grow="1">
    <Heading>Translate prompts</Heading>
    <AlertDialog open={open} onOpenChange={setOpen}>
  
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Prompt translations complete</AlertDialogTitle>
      <AlertDialogDescription>
        Download your data below. Cancel closes this alert.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDownload}>Download data</AlertDialogAction>
{/*       <AlertDialogAction>
      <Link href="/comparison">
        Continue
        </Link>
        </AlertDialogAction>
        */}
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    <Flex gap="3">

    <Select onValueChange={value => setSelectedSize(Number(value))}>
  <SelectTrigger className="w-[150px]">
  <Flex justify="start" gap="3" align="center">
    <RulerHorizontalIcon/>
    <SelectValue placeholder="10 samples" />
    </Flex>
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="10">10 samples</SelectItem>
    <SelectItem value="20">20 samples</SelectItem>
    <SelectItem value="30">30 samples</SelectItem>
  </SelectContent>
</Select>


    <Select onValueChange={value => setLanguage(value)}>
  <SelectTrigger className="w-[150px]">
  <Flex justify="start" gap="3" align="center">
    <GlobeIcon/>
    <SelectValue placeholder="Welsh" />
    </Flex>
    
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="welsh">Welsh</SelectItem>
    <SelectItem value="yoruba">Yoruba</SelectItem>
    <SelectItem value="igala">Igala</SelectItem>
    <SelectItem value="afrikaans">Afrikaans</SelectItem>
    <SelectItem value="zulu">Zulu</SelectItem>
    <SelectItem value="xhosa">Xhosa</SelectItem>
  </SelectContent>
</Select>

<Select onValueChange={value => setModel(value)}>
        <SelectTrigger className="w-[150px]">
          <Flex justify="start" gap="3" align="center">
            <RocketIcon/>
            <SelectValue placeholder="gpt-3.5" />
          </Flex>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="openai">gpt-3.5</SelectItem>
        </SelectContent>
      </Select>

<Select onValueChange={value => setSelectedDataset(value)}>
  <SelectTrigger className="w-[140px]">
  <Flex justify="start" gap="3" align="center">
  <Braces className="mr-2 h-4 w-4" />
    <SelectValue placeholder="WikiQA"/>
    </Flex>
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="squad">SquAD</SelectItem>
    <SelectItem value="wikiqa">WikiQA</SelectItem>
  </SelectContent>
</Select>

<Button onClick={handleDownload} disabled={Object.keys(completions).length === 0} variant={Object.keys(completions).length === 0 ? "secondary" : "default"}>
  <DownloadIcon className="mr-2"/>Download
</Button>

    </Flex>
  </Flex>
  
  <Separator my="3" size="4" />
  
  <Table.Root variant="surface" >
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeaderCell width={1}>No.</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell width="50%">Prompt (English)</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell width="50%">Translation</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell width={1} justify="center">Confirmed</Table.ColumnHeaderCell>
    </Table.Row>
  </Table.Header>
  

  <Table.Body>
          {data
            .slice(0, selectedSize)
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((row, index) => (
            <Table.Row key={index}>
              <Table.RowHeaderCell><Code>{index + 1}</Code></Table.RowHeaderCell>
              <Table.Cell><Code>{row.question}</Code></Table.Cell>
              <Table.Cell>
              <Input 
                  value={completions[row.question] || ' '}
                  onChange={e => handleInputChange2(e, row.question)}
                  className='h-8'
                />
              </Table.Cell>
              <Table.Cell justify="center"><Switch onCheckedChange={handleSwitchChange} /></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

</Table.Root>

  <Separator my="3" size="4" />

  <Flex direction="row" justify="between" grow="1" align="center">
  <Code>{`${currentPage}/${Math.ceil(selectedSize / itemsPerPage)}`}</Code> 
    <Flex gap="3" align="center">
    Back
          <Button variant="secondary" size="icon" onClick={handleBack} disabled={currentPage === 1}>
            <ChevronLeftIcon />
          </Button>
          <Button variant="secondary" size="icon" onClick={handleNext} disabled={currentPage === Math.ceil(selectedSize / itemsPerPage)}>
            <ChevronRightIcon />
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