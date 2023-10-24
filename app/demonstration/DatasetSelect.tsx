// app/demonstration/DatasetSelect.tsx
'use client'
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DatasetSelect() {
  const [selectedDataset, setSelectedDataset] = useState(null);

  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Choose dataset" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="squad" onSelect={() => setSelectedDataset('squad')}>SquAD</SelectItem>
        <SelectItem value="wiki" onSelect={() => setSelectedDataset('wiki')}>WikiQA</SelectItem>
        <SelectItem value="custom">Add custom</SelectItem>
      </SelectContent>
    </Select>
  );
}