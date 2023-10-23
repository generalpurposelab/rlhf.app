<a href="https://rlhf.app/">
  <img alt="Open-source platform for fine-tuning LLMs in low-resource languages." src="https://github.com/ebayes/rlhf/blob/main/public/cover_photo.png"> 
  <h1 align="center">rlhf.app</h1>
</a>

<p align="center">
rlhf.app is an open-source platform for fine-tuning LLMs in low-resource languages that creates workflows for supervised fine-tuning, preference tuning (RLHF and more), and scalable evaluation.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a> ·
  <a href="#stack"><strong>Stack</strong></a> .
  <a href="#authors"><strong>Authors</strong></a>
</p>
<br/>

## Features
- *Supervised fine-tuning* - generate
- *Preference tuning (RLHF and more)* - generate
- *Scalable evaluation* - 

## Model Providers

This template ships with Meta's Llama 2 as the default. However, you can switch LLM providers to [Hugging Face](https://huggingface.co), [OpenAI](https://openai.com/),  [Anthropic](https://anthropic.com),  or using [LangChain](https://js.langchain.com) with just a few lines of code.


## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000/).

## Stack

rlhf.app is built with Next.js, the Vercel AI SDK, OpenAI, and Vercel KV.

## Authors

This library is created by [Equiano Institute](https://equiano.institute) and [General Purpose](https://general-purpose.io) team members, with contributions from:

- Jonas Kgomo ([@jonas-kgomo](https://github.com/jonas-kgomo)) - [Equiano Institute](https://equiano.institute)
- Kayode Olaleye ([@kayodeolaleye](https://github.com/kayodeolaleye)) - [University of Pretoria](https://dsfsi.github.io/)
- Jonathan Smith ([@jajsmith](https://github.com/jajsmith)) - [Meta](https://about.meta.com)
- Ed Bayes ([@ebayes](https://github.com/ebayes)) - [General Purpose](https://general-purpose.io)
