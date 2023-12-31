'use client'
// app/demonstration/DatasetTable.tsx
import { useState } from 'react';
import { Flex, Heading, Separator, Text, Box, Kbd, Link, AspectRatio, Grid } from '@radix-ui/themes';
import Image from 'next/image';
import { Database, Download } from 'lucide-react';
import { ChevronRightIcon, DashboardIcon, GlobeIcon, RulerHorizontalIcon } from '@radix-ui/react-icons';
import styled from 'styled-components';

const ResponsiveGrid = styled(Grid)`
  @media (max-width: 768px) {
    grid-template-columns: 1fr !important;
  }
`;

export default function DataTable() {

  return (
    <>
          <form style={{height: '100%', overflowY: 'scroll'}}>

    <Flex direction="row" justify="between" grow="1">
    <Heading>Instructions</Heading>

  </Flex>
  <Separator my="3" size="4" />
  <Flex gap="3" direction="column" style={{height: '80vh', flexGrow: 1}}>
  

  <ResponsiveGrid columns="2" gap="2" width="auto">
  <Box >
  <Heading size="3" style={{ marginBottom: '10px' }}>Translate prompts</Heading>
  <Text size="2" style={{ color: 'black' }}>
  <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
  <li style={{ marginBottom: '5px' }}>Click the <Kbd ><Database className="mr-1 h-2 w-2" /> Dataset</Kbd> dropdown button to select the dataset you want to use.</li>
    <li style={{ marginBottom: '5px' }}>The app defaults to <i>Sample data</i> based on <Link weight="medium" underline="always" href="https://www.microsoft.com/en-us/download/details.aspx?id=52419">WikiQA</Link> but you can upload your own dataset (in <Link weight="medium" underline="always" href="https://github.com/generalpurposelab/rlhf.app/blob/main/app/prompts/wikiqa.json">this format</Link>).</li>
    <li style={{ marginBottom: '5px' }}>Click the <Kbd ><GlobeIcon className="mr-1 h-2 w-2"/> Select language</Kbd> dropdown button to select the language you want to translate the prompt dataset to (it defaults to Yoruba).</li>
    <li style={{ marginBottom: '5px' }}>Click the <Kbd >Generate</Kbd> button in the bottom right hand corner to generate translations.</li>
    <li style={{ marginBottom: '5px' }}>Edit the translations until they are correct.</li>
    <li style={{ marginBottom: '5px' }}>Once you are happy with the translations, you can click <Kbd style={{ backgroundColor: 'black', color: 'white' }}><Download className="mr-1 h-2 w-2" style={{ color: 'white' }}/> Download</Kbd> to download them locally.</li>
  </ul>
</Text>
  </Box>
  <Box>
  <AspectRatio ratio={16 / 9}>
  <img
    src="/translate_prompts.png"
    alt="translate prompts"
    style={{
      objectFit: 'cover',
      width: '100%',
      height: '100%',
      borderRadius: 'var(--radius-2)',
    }}
  />
</AspectRatio>
  </Box>
  <Box >
  <Heading size="3" style={{ marginBottom: '10px' }}>Translate completions</Heading>
  <Text size="2" style={{ color: 'black' }}>
  <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
  <li style={{ marginBottom: '5px' }}>Click the <Kbd><Database className="mr-1 h-2 w-2" /> Dataset</Kbd> dropdown button to upload the dataset you just created, or custom data in <Link weight="medium" underline="always" href="https://github.com/generalpurposelab/rlhf.app/blob/main/app/prompts/wikiqa.json">this format</Link>. It defaults to a test dataset in Yoruba.</li>
  <li style={{ marginBottom: '5px' }}>Click the <Kbd ><RulerHorizontalIcon className="mr-1 h-2 w-2" />samples</Kbd> dropdown at the top to choose how many samples you want to generate. It defaults to 3.</li>
    <li style={{ marginBottom: '5px' }}>Click the <Kbd >Generate</Kbd> button in the bottom right hand corner to generate translations.</li>
    <li style={{ marginBottom: '5px' }}>Choose the most accurate answer from the multiple answers provided, and then edit it so it is <b>truthful</b>, <b>harmless</b>, <b>culturally relevant</b>, and <b>helpful</b>. Hover over the badges on the right of the page for definitions.</li>
    <li style={{ marginBottom: '5px' }}>Once you are happy with the answer, click <Kbd ><ChevronRightIcon className="mr-1 h-2 w-2" /> Next</Kbd> to go to the next question and repeat these steps.</li>
    <li style={{ marginBottom: '5px' }}>Once you have finished, click <Kbd style={{ backgroundColor: 'black', color: 'white' }}><Download className="mr-1 h-2 w-2" style={{ color: 'white' }}/> Download</Kbd> to download them locally.</li>
  </ul>
</Text>

  </Box>
  <Box>
  <AspectRatio ratio={16 / 9}>
  <img
    src="/translate_completions.png"
    alt="translate completions"
    style={{
      objectFit: 'cover',
      width: '100%',
      height: '100%',
      borderRadius: 'var(--radius-2)',
    }}
  />
</AspectRatio>
  </Box>
  
</ResponsiveGrid>

  
  </Flex>

</form>
</>

  );
}