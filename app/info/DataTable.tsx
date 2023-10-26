'use client'
// app/demonstration/DatasetTable.tsx
import { useState } from 'react';
import { Flex, Heading, Separator, Text } from '@radix-ui/themes';

export default function DataTable() {

  return (
    <>
          <form style={{height: '100%'}}>

    <Flex direction="row" justify="between" grow="1">
    <Heading>Info</Heading>

  </Flex>
  <Separator my="3" size="4" />
  <Flex gap="3" direction="column" style={{height: '80vh', flexGrow: 1}}>
  <Heading size="4">Instructions</Heading>

  <Text size="2">Go here</Text>

  
  </Flex>

</form>
</>

  );
}