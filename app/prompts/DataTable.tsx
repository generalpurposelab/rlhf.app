// prompt/DataTable.tsx


'use client'

import { useState, useEffect, useRef } from 'react';
import wikiqa from './wikiqa.json';
import { Input } from "@/components/ui/input"
import { Flex, Heading, Separator, Table, Code, Text, Kbd, Em, Link } from '@radix-ui/themes';
import { Switch } from "@/components/ui/switch"
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, RocketIcon, FileTextIcon, GlobeIcon, MagicWandIcon, PlusIcon, RulerHorizontalIcon, EyeClosedIcon, Cross1Icon, ChevronDownIcon, QuestionMarkCircledIcon, DashboardIcon } from '@radix-ui/react-icons'
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
import { useToast } from "@/components/ui/use-toast"
import { logPrompts } from "@/lib/supabase"

export default function DataTable() {
  
  const [data, setData] = useState<any[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>("Sample data");
  const [language, setLanguage] = useState<string>("Yoruba");
  const [selectedSize, setSelectedSize] = useState<number>();
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
  const buttonWidthClass = "w-[14rem]";
  const [currentCount, setCurrentCount] = useState<number>(0);
  const { toast } = useToast()

  const handleSwitchChange = (checked: boolean) => {
    setCheckedCount(prevCount => checked ? prevCount + 1 : prevCount - 1);
  }

  const [open, setOpen] = useState(false);
  

  const fetchData = async () => {
    setIsLoading(true);
  
    const size = selectedSize ?? 0;
  
    for (let i = 0; i < size; i++) {
      try {
        let results: string[] = [];
        const preprompt = `Translate the following into ${language}:`;
  
        if (model === 'gpt-3.5-turbo' || model === 'gpt-4') {
          results = await callOpenai(data, i, 1, preprompt, model);
        } else {
          results = await callOSS(data, i, 1, preprompt);
        }
  
        setCompletions(prev => ({ ...prev, [data[i].question]: results[0] }));
        setCurrentCount(i + 1); 
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "A question was skipped. You'll have to add it in manually.",
        });
      }
    }
  
    setIsLoading(false);
  };

  const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement>, prompt: string) => {
    const value = e.target.value;
    setCompletions(prev => ({ ...prev, [prompt]: value }));
  }

  const handleDownload = async () => {
    const dataArr = Object.values(completions).map(answer => ({ question: answer }));
    const dataStr = JSON.stringify(dataArr);
    await logPrompts(dataStr);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.download = 'prompts.json';
    link.href = url;
    link.click();
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(selectedSize ? selectedSize / itemsPerPage : 0)));
  };

  const handleBack = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    if (selectedDataset === 'Sample data') {
      setData(wikiqa);
    }
    setSelectedSize(10);
  }, [selectedDataset, data]);

  useEffect(() => {
    if (checkedCount === selectedSize) {
      setOpen(true);
    }
  }, [checkedCount, selectedSize]);



  return (
    <>
     

    <Flex direction="row" justify="between" grow="1" align="center">
    <div className="flex">
  <Heading>Translate prompts</Heading>
 
{/* 
  <Button
      variant="outline"
      onClick={() => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request. Try again.",
        })
      }}
    >
      Show Toast
    </Button>
    */}


  <AlertDialog>
  <AlertDialogTrigger>
    <Button size="icon" variant="ghost" className='pb-1'>
      <QuestionMarkCircledIcon className="h-4 w-4"/>
    </Button>
    
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle style={{ marginBottom: '10px' }}>How to translate prompts</AlertDialogTitle>
      <AlertDialogDescription>
      <Text style={{ color: 'black' }}>
  <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
  <li style={{ marginBottom: '10px' }}>Click the <Kbd style={{ backgroundColor: '#f2f2f2', borderRadius: '5px' }}><Database className="mr-1 h-2 w-2" /> Dataset</Kbd> dropdown button to select the dataset you want to use.</li>
    <li style={{ marginBottom: '10px' }}>You can either upload your own dataset (which should be in <Link weight="medium" underline="always" href="https://github.com/generalpurposelab/rlhf.app/blob/main/app/prompts/wikiqa.json">this format</Link>), or choose the <Em>Sample data</Em> dataset, which is taken from <Link weight="medium" underline="always" href="https://www.microsoft.com/en-us/download/details.aspx?id=52419">WikiQA</Link>.</li>
    <li style={{ marginBottom: '10px' }}>Click the <Kbd style={{ backgroundColor: '#f2f2f2', borderRadius: '5px' }}><GlobeIcon className="mr-1 h-2 w-2"/> Select language</Kbd>dropdown button to select the language you want to translate the prompt dataset to.</li>
    <li style={{ marginBottom: '10px' }}>Click the <Kbd style={{ backgroundColor: '#f2f2f2', borderRadius: '5px' }}>Generate</Kbd> button in the bottom right hand corner to generate translations.</li>
    <li style={{ marginBottom: '10px' }}>Edit the translations until they are correct.</li>
    <li style={{ marginBottom: '10px' }}>Once you are happy with the translations, you can click <Kbd style={{ backgroundColor: '#f2f2f2', borderRadius: '5px' }}>Download</Kbd> to download them locally, or click the <Kbd style={{ backgroundColor: '#f2f2f2', borderRadius: '5px' }}><DashboardIcon className="mr-1 h-2 w-2"/>Translate completions</Kbd> button in the left sidebar to continue.</li>
  </ul>
</Text>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Close</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  
</div>




    <Flex gap="3">
<div className='hidden lg:block sm:hidden'>
<Select onValueChange={value => {
  setSelectedSize(value === "All" ? data.length : Number(value));
  setCurrentPage(1);
}} disabled={data.length === 0}>
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
    <SelectItem value="All">All</SelectItem>
  </SelectContent>
</Select>
</div>


<div className='hidden lg:block sm:hidden'>

{isCustomLanguage ? (
  <>
<Flex gap="3" style={{width: '14rem'}}>
  <Input 
    style={{flex: 1}}  
    placeholder="Add language" 
    onChange={(e) => setLanguage(e.target.value)}
  />
  <Button size="icon" variant="secondary" onClick={() => setIsCustomLanguage(false)}>
    <Cross1Icon/>
  </Button>
</Flex>
  </>
) : (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
    <Button variant="outline" className={buttonWidthClass}>
  <Flex justify="between" align="center" grow="1">
    <Flex align="center">
      <GlobeIcon className="mr-2"/>
      <span>Select language</span>
    </Flex>
    <ChevronDownIcon/>
  </Flex>
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
</div>
{/* 
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
      */}


      <DropdownMenu>
<DropdownMenuTrigger asChild>
  <Button variant="outline" className="w-40">

  <Flex justify="between" align="center" grow="1">
    <Flex align="center">
    <Database className="mr-2 h-4 w-4" />
    <span>{selectedDataset}</span>

    </Flex>
    <ChevronDownIcon/>
  </Flex>

  </Button>
</DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel className="text-center">Data source</DropdownMenuLabel>
        <DropdownMenuSeparator />

<DropdownMenuRadioGroup value={selectedDataset} onValueChange={value => {
    setCurrentPage(1);
    setSelectedDataset(value);

}}>
  <DropdownMenuRadioItem value="Sample data">
    <Database className="mr-2 h-4 w-4" />
    <span>Sample data</span>
  </DropdownMenuRadioItem>
  {/* 
  <DropdownMenuRadioItem value="squad">
    <Database className="mr-2 h-4 w-4" />
    <span>SquAD</span>
  </DropdownMenuRadioItem>
  */}
  <DropdownMenuSeparator />
  <DropdownMenuRadioItem 
    value="Custom"
    onSelect={() => {
      setCurrentPage(1);
      fileInputRef.current?.click();
    }}
  >
    <PlusCircle className="mr-2 h-4 w-4" />
    <span>Upload</span>
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
  <Flex grow="1">
  <Table.Root variant="surface" style={{ width: '100%' }}>  <Table.Header>
    <Table.Row>
      <Table.ColumnHeaderCell width={1}>No.</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell width="50%">Prompt (English)</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell width="50%">Translation</Table.ColumnHeaderCell>
      {/* <Table.ColumnHeaderCell width={1} justify="center">Confirmed</Table.ColumnHeaderCell> */}
    </Table.Row>
  </Table.Header>
  

  <Table.Body>
          {data
            .slice(0, selectedSize)
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((row, index) => (
            <Table.Row key={index}>
              <Table.RowHeaderCell><Code>{index + 1}</Code></Table.RowHeaderCell>
              <Table.Cell>
  <Code style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
    {row.question}
  </Code>
</Table.Cell>              <Table.Cell>
              <Input 
                  value={completions[row.question] || ' '}
                  onChange={e => handleInputChange2(e, row.question)}
                  className='h-8'
                />
              </Table.Cell>
             {/* <Table.Cell justify="center"><Switch onCheckedChange={handleSwitchChange} /></Table.Cell> */}
            </Table.Row>
          ))}
        </Table.Body>

</Table.Root>
</Flex>

<Flex direction="column" className="fixed inset-x-22 bottom-0 bg-white w-full pr-24 pb-3">
  <Separator my="3" size="4" />

  <Flex direction="row" justify="between" grow="1" align="center">

  <Code>{`${currentPage}/${Math.ceil(selectedSize ? selectedSize / itemsPerPage : 0)}`}</Code>
    <Flex gap="3" align="center">
    Back
          <Button variant="secondary" size="icon" onClick={handleBack} disabled={currentPage === 1}>
            <ChevronLeftIcon />
          </Button>
          <Button variant="secondary" size="icon" onClick={handleNext} disabled={currentPage === Math.ceil(selectedSize ? selectedSize / itemsPerPage : 0)}>
  <ChevronRightIcon />
</Button>
Next
            
      <Button onClick={fetchData} disabled={isLoading} className='w-24'>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {`${currentCount}/${selectedSize}`}
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