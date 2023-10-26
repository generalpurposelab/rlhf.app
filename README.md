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
  <a href="#authors"><strong>Authors</strong></a>
</p>
<br/>

## Features
- *Supervised fine-tuning* - generate translations for prompt libraries based on publicly available set of question and sentence pairs like WikiQA, and generate editable outputs
- *Preference tuning (RLHF and more)* - coming soon
- *Scalable evaluation* - coming soon

## Model Providers

This template ships with GPT 3.5, GPT 4, Llama 2, and Mistral-7B-Instruct-v0.1. However, you can switch LLM providers by changing [a few lines of code](https://github.com/ebayes/rlhf/blob/main/lib/llms.js).


## Running locally

You will need to use the environment variables [defined in `.env.local.example`](.env.local.example) to run. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

## Authors

This library is created by [Equiano Institute](https://equiano.institute) and [General Purpose](https://general-purpose.io) team members, with contributions from:
