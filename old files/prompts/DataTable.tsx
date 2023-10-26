'use client'
// app/demonstration/DatasetTable.tsx
import { useState, useEffect, useRef } from 'react';
import wikiqa from './wikiqa.json';
import squad from './squad.json';
import { Input } from "@/components/ui/input"
import { Flex, Heading, Separator, Table, Code, Text } from '@radix-ui/themes';
import { Switch } from "@/components/ui/switch"
import { DownloadIcon, FileTextIcon, GlobeIcon, MagicWandIcon, PlusIcon, RulerHorizontalIcon } from '@radix-ui/react-icons'
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

export default function DataTable() {
  
  const [data, setData] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState("wikiqa");
  const [language, setLanguage] = useState("");
  const [selectedSize, setSelectedSize] = useState(10);
  const [completions, setCompletions] = useState({});
  const currentIndex = useRef(0);
  const [checkedCount, setCheckedCount] = useState(0);
  const handleSwitchChange = (checked) => {
    setCheckedCount(prevCount => checked ? prevCount + 1 : prevCount - 1);
  }
  const [open, setOpen] = useState(false);

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
    const dataStr = JSON.stringify(completions);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.download = 'completions.json';
    link.href = url;
    link.click();
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
          <form onSubmit={handleSubmit}>

    <Flex direction="row" justify="between" grow="1">
    <Heading>Translate prompts</Heading>
    <AlertDialog open={open} onOpenChange={setOpen}>
  
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Demonstrations complete</AlertDialogTitle>
      <AlertDialogDescription>
        Download your data or click continue to port your data through to the next stage. Cancel closes this window.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDownload}>Download data</AlertDialogAction>
      <AlertDialogAction>
      <Link href="/comparison">
        Continue
        </Link>
        </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    <Flex gap="3">

    <Select onValueChange={value => setLanguage(value)}>
  <SelectTrigger className="w-[200px]">
  <Flex justifyContent="flex-start" gap="3" align="center">
    <GlobeIcon/>
    <SelectValue placeholder="Choose language" />
    </Flex>
    
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="welsh">Welsh</SelectItem>
    <SelectItem value="yoruba">Yoruba</SelectItem>
    <SelectItem value="igala">Igala</SelectItem>
    <SelectItem value="custom">Add custom</SelectItem>
  </SelectContent>
</Select>

<Select onValueChange={value => setSelectedDataset(value)}>
  <SelectTrigger className="w-[140px]">
  <Flex justifyContent="flex-start" gap="3" align="center">
    <FileTextIcon/>
    <SelectValue placeholder="WikiQA"/>
    </Flex>
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="squad">SquAD</SelectItem>
    <SelectItem value="wikiqa">WikiQA</SelectItem>
    <SelectItem value="custom">Add custom</SelectItem>
  </SelectContent>
</Select>

<Select onValueChange={value => setSelectedSize(Number(value))}>
  <SelectTrigger className="w-[100px]">
  <Flex justifyContent="flex-start" gap="3" align="center">
    <RulerHorizontalIcon/>
    <SelectValue placeholder="10" />
    </Flex>
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="10">10</SelectItem>
    <SelectItem value="20">20</SelectItem>
    <SelectItem value="custom">Custom</SelectItem>
  </SelectContent>
</Select>

<Button type="submit">
        <MagicWandIcon className="mr-2"/>Create prompts
      </Button>

      <Button onClick={handleDownload} disabled={Object.keys(completions).length === 0} variant={Object.keys(completions).length === 0 ? "secondary" : ""}>
  <DownloadIcon className="mr-2"/>Download
</Button>

    </Flex>
  </Flex>
  <Separator my="3" size="4" />

  <Table.Root variant="surface">
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeaderCell width={1}>No.</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell width="50%">Prompt (English)</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell width="50%">Translation</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell width={1} justify="center">Confirmed</Table.ColumnHeaderCell>
    </Table.Row>
  </Table.Header>
  

  <Table.Body>
          {data.slice(0, selectedSize).map((row, index) => (
            <Table.Row key={index}>
              <Table.RowHeaderCell><Code>{index + 1}</Code></Table.RowHeaderCell>
              <Table.Cell><Code>{row.Prompt}</Code></Table.Cell>
              <Table.Cell>
              <Input 
                  value={completions[row.Prompt] || ' '}
                  onChange={e => handleInputChange2(e, row.Prompt)}
                />
              </Table.Cell>
              <Table.Cell justify="center"><Switch onCheckedChange={handleSwitchChange} /></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

</Table.Root>
</form>
</>

  );
}