import OpenAI from "openai";
import { HfInference } from '@huggingface/inference'
import Replicate from "replicate";

export const runtime = 'edge';

const hf = new HfInference('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');

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export const callOSS = async (inputData, promptIndex, sampleNumber, preprompt) => {
  const results = [];
  for (let i = 0; i < sampleNumber; i++) {
    const result = await hf.textGeneration({
      model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
      inputs: `${preprompt} ${inputData[promptIndex].question}`,
      parameters: {
        max_new_tokens: 200,
        typical_p: 0.2,
        repetition_penalty: 1,
        truncate: 1000,
        return_full_text: false,
      },
    });
    console.log(result.generated_text);
    results.push(result.generated_text);
  }
  return results;
};

export const callOpenai = async (inputData, promptIndex, sampleNumber, preprompt) => {
  let results = [];

  for (let i = 0; i < sampleNumber; i++) {
    const result = await openai.chat.completions.create({
      messages: [{ role: "user", content: `${preprompt} ${inputData[promptIndex].question}` }],
      model: "gpt-3.5-turbo",
    });

    results.push(result.choices[0].message.content);
  }

  return results;
};

export const callLlama = async (inputData, promptIndex, sampleNumber, preprompt) => {
  const results = [];
  for (let i = 0; i < sampleNumber; i++) {
    const result = await replicate.predictions.create({
      stream: false,
      version: '2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1',
      input: {
        prompt: `${preprompt} ${inputData[promptIndex].question}`
      }
    });
    console.log(result.generated_text);
    results.push(result.generated_text);
  }
  return results;
};

export const callMistral = async (inputData, promptIndex, sampleNumber, preprompt) => {
  const results = [];
  for (let i = 0; i < sampleNumber; i++) {
    const result = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.1',
      inputs: `${preprompt} ${inputData[promptIndex].question}`,
    });
    console.log(result.generated_text);
    results.push(result.generated_text);
  }
  return results;
};