import React from 'react'
import { Box, TextArea } from '@radix-ui/themes';
import { CursorArrowIcon, CheckIcon } from '@radix-ui/react-icons'
import { Button } from "@/components/ui/button"

function ResponseBox({ onClick, isSelected }) {
  return (
    <>
      <Box grow="1" >
        <TextArea placeholder="Reply to comment…" className="mb-3" style={{height: '58vh'}}/>
        <Button variant={isSelected ? "destructive" : "outline"} fullWidth onClick={onClick}>
          {isSelected ? <CheckIcon className="mr-2"/> : <CursorArrowIcon className="mr-2"/>}
          Select
        </Button>
      </Box>
    </>
  )
}

export default ResponseBox