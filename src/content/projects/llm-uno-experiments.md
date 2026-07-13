---
title: "LLM UNO Experiments"
description: "Experiment scripts and prompt templates for benchmarking LLM agents in UNO across model families and prompting strategies."
repoUrl: "https://github.com/yagoromano/llm-uno-experiments"
tags: ["Python", "LLM Evaluation", "RLCard"]
cover: "/covers/llm-uno-experiments.svg"
order: 5
---

## What it is

The experiment companion to the llm-uno package and the reproducibility repo cited in my first-author ICMLA 2025 paper: runnable scripts and prompt templates for benchmarking how different language models and prompting strategies perform as UNO players.

## What it covers

- Single-node runs for models that fit on one GPU, and a distributed setup using torchrun under SLURM for large models like Llama-70B.
- Prompt templates tuned per model family, including Llama 8B, Llama 70B, and Mistral 24B, in both cloze and counterfactual prompting variants.
- Scripts for running agents against local Hugging Face models, DeepSpeed-sharded models across nodes, or hosted models through OpenRouter.

## Why it is separate

Keeping experiments out of the core package keeps llm-uno itself lightweight and installable, while this repo can freely accumulate model-specific configuration, cluster launch scripts, and result logs without weighing the library down.

## What I took away

Comparing the same game across prompting strategies made the differences concrete: cloze scoring is cheap and consistent, while counterfactual prompting trades tokens for more deliberate play. Building the harness to make those comparisons repeatable was the real work.
