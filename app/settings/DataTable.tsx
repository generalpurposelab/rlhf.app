'use client'
// app/demonstration/DatasetTable.tsx
import { useState } from 'react';
import { Flex, Heading, Separator, Text, Grid, Box } from '@radix-ui/themes';
import { Input } from '@/components/ui/input';

export default function DataTable() {
  const [model, setModel] = useState("");

  return (
    <>
          <form style={{height: '100%'}}>

    <Flex direction="row" justify="between" grow="1">
    <Heading>Settings</Heading>

  </Flex>
  <Separator my="3" size="4" />
  <Flex gap="3" direction="column" style={{height: '80vh', flexGrow: 1}}>
  {/* <Heading size="4">Choose model</Heading> */}

  <Text size="2">Add your API keys below.</Text>
  
  
  


  
  </Flex>

</form>
</>

  );
}