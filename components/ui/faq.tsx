import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  return (
    <Accordion type="single" collapsible className="w-[550px] ">
      <AccordionItem value="item-1">
        <AccordionTrigger>How should you review completions</AccordionTrigger>
        <AccordionContent>
          Choose the most accurate answer from the multiple answers provided,
          and then edit it so it is truthful, harmless, culturally relevant, and
          helpful. Hover over the badges on the right of the page for
          definitions. Once you are happy with the answer, click to go to the
          next question and repeat these steps.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it open source?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with ability to append your own API
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>How is the data collected</AccordionTrigger>
        <AccordionContent>
          The app defaults to Sample data based on WikiQA but you can upload
          your own dataset (in this format). Click the dropdown button to upload
          the dataset you just created, or custom data in this format. It
          defaults to a test dataset in Yoruba. Click the dropdown at the top to
          choose how many samples you want to generate. It defaults to 3. Click
          the button in the bottom right hand corner to generate translations.
          Once you have finished, click to download them locally.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
