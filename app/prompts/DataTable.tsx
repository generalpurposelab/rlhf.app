'use client'
// app/demonstration/DatasetTable.tsx
import { useState, useEffect, useRef } from 'react';
import wikiqa from './wikiqa.json';
import squad from './squad.json';
import { Input } from "@/components/ui/input"
import { Flex, Heading, Separator, Table, Code, Text } from '@radix-ui/themes';
import { Switch } from "@/components/ui/switch"
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, RocketIcon, FileTextIcon, GlobeIcon, MagicWandIcon, PlusIcon, RulerHorizontalIcon, EyeClosedIcon, Cross1Icon } from '@radix-ui/react-icons'
import { RiOpenaiFill } from 'react-icons/ri';
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
  Database,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DataTable() {
  
  const [data, setData] = useState<any[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>("wikiqa");
  const [language, setLanguage] = useState<string>("Welsh");
  const [selectedSize, setSelectedSize] = useState<number>(10);
  const [completions, setCompletions] = useState<Record<string, any>>({});
  const [promptIndex, setPromptIndex] = useState<number>(0);
  const [checkedCount, setCheckedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [model, setModel] = useState<string>('gpt-3.5-turbo');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 10;
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isCustomLanguage, setIsCustomLanguage] = useState<boolean>(false);
  const buttonWidthClass = "w-56";

  const handleSwitchChange = (checked: boolean) => {
    setCheckedCount(prevCount => checked ? prevCount + 1 : prevCount - 1);
  }

  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
  
    for (let i = 0; i < selectedSize; i++) {
      let results: string[] = [];
      const preprompt = `Translate the following into ${language}:`;
  
      if (model === 'gpt-3.5-turbo' || model === 'gpt-4') {
        results = await callOpenai(data, i, 1, preprompt, model);
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

    <Select onValueChange={value => setSelectedSize(Number(value))} disabled={data.length === 0}>
  <SelectTrigger className="w-36">
  <Flex justify="start" gap="3" align="center">
    <RulerHorizontalIcon/>
    <SelectValue placeholder="10 samples" />
    </Flex>
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="10">10 samples</SelectItem>
    <SelectItem value="20">20 samples</SelectItem>
    <SelectItem value="30">30 samples</SelectItem>
    <SelectItem value={data.length.toString()}>All</SelectItem>
  </SelectContent>
</Select>


   
{isCustomLanguage ? (
  <>
  <Input 
  className="w-44"  
  placeholder="Add language" 
    onChange={(e) => setLanguage(e.target.value)}
  />
<Button size="icon" variant="secondary" onClick={() => setIsCustomLanguage(false)}>
  <Cross1Icon/>
</Button>
  </>
) : (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className={buttonWidthClass} >
        <GlobeIcon className="mr-2"/>
        <span>{language}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className={buttonWidthClass} >
      <DropdownMenuLabel className="text-center">Language</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup 
        value={language} 
        onValueChange={value => {
          setLanguage(value);
          if (value !== "Custom") {
            setIsCustomLanguage(false);
          }
        }}
      >
        <DropdownMenuRadioItem value="Welsh">
      <p className="mr-2">🏴󠁧󠁢󠁷󠁬󠁳󠁿</p>
            <span>Welsh</span>
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="Yoruba">
      <p className="mr-2">🇳🇬</p>
            <span>Yoruba</span>
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="Igala">
      <p className="mr-2">🇳🇬</p>
            <span>Igala</span>
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="Afrikaans">
      <p className="mr-2">🇿🇦</p>
            <span>Afrikaans</span>
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="Zulu">
      <p className="mr-2">🇿🇦</p>
            <span>Zulu</span>
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="Xhosa">
      <p className="mr-2">🇿🇦</p>
            <span>Xhosa</span>
      </DropdownMenuRadioItem>
      <DropdownMenuSeparator />
        <DropdownMenuRadioItem 
          value="Custom"
          onSelect={() => setIsCustomLanguage(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          <span>Custom</span>
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
)}

<Select onValueChange={value => setModel(value)}>
        <SelectTrigger className="w-36">
          <Flex justify="start" gap="3" align="center">
          <RiOpenaiFill/>
            <SelectValue placeholder="gpt-3.5" />
          </Flex>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gpt-3.5-turbo">gpt-3.5</SelectItem>
          <SelectItem value="gpt-4">gpt-4</SelectItem>
        </SelectContent>
      </Select>


      <DropdownMenu>
<DropdownMenuTrigger asChild>
  <Button variant="outline" className="w-36">
  <Braces className="mr-2 h-4 w-4" />
    <span>{selectedDataset}</span>
  </Button>
</DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuLabel className="text-center">Data source</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={selectedDataset} onValueChange={value => setSelectedDataset(value)}>
        <DropdownMenuRadioItem value="wikiqa">
          <Database className="mr-2 h-4 w-4" />
            <span>WikiQA</span>
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="squad">
          <Database className="mr-2 h-4 w-4" />
            <span>SquAD</span>
          </DropdownMenuRadioItem>
          <DropdownMenuSeparator />
          <DropdownMenuRadioItem 
            value="Custom"
            onSelect={() => fileInputRef.current?.click()}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Custom</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    <input 
          ref={fileInputRef}
          type="file" 
          accept=".json" 
          style={{ display: 'none' }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              const file = e.target.files[0];
              if (file) {
                setUploadedFileName(file.name); // Set the uploaded file name
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