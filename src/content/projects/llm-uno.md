---
title: "LLM UNO"
description: "An installable RLCard extension that lets decoder-only LLMs play UNO as agents, from single-GPU models to distributed 70B inference. Basis for a first-author IEEE ICMLA 2025 paper."
repoUrl: "https://github.com/yagoromano/llm-uno"
tags: ["Python", "LLM Agents", "RLCard", "LLM Evaluation", "Distributed ML"]
cover: "/covers/llm-uno.svg"
order: 2
featured: true
badge: "IEEE ICMLA 2025"
badgeTone: "paper"
outcome: "1B to 70B parameter models · up to 10,000 distributed games per configuration"
paper:
  title: "LLMs as Agentic Cooperative Players in Multiplayer UNO"
  venue: "IEEE International Conference on Machine Learning and Applications (ICMLA) 2025"
  authors: "Yago Romano Martinez, Jesse Roberts"
  url: "https://arxiv.org/abs/2509.09867"
---

## What it is

A pip-installable Python package that extends RLCard, the card-game reinforcement learning toolkit, so decoder-only LLMs can play UNO as agents. It is the codebase behind my first-author ICMLA 2025 paper.

Most work on LLMs in games asks whether a model can win. This paper asks something different: whether an LLM can act as a non-player character that helps a different player win.

## What the paper tested

Two settings, across four models (LLaMA-3.2-1B, LLaMA-3.1-8B, Mistral-24B, LLaMA-3.3-70B), two prompting strategies, and 10,000 games per configuration.

**Autonomous play.** The LLM plays head to head against a random agent. Every model beat the random baseline with statistical significance under at least one prompting strategy. Mistral-24B was the best at 52.1% with cloze prompting, close to what RLCard's trained DQN agent reaches, with no fine-tuning.

**Cooperative play.** The LLM takes a third seat and is told to help a rule-based teammate win instead of winning itself. Solo performance did not carry over. Against a 35.0% unassisted baseline, only LLaMA-3.3-70B with cloze prompting passed the significance threshold. The rest came close but did not clear it.

## Engineering details

**Correcting for token bias.** Small models tend to pick whichever action is labeled "A" regardless of the game state, a base-rate effect rather than a real preference. The agent rotates the action-to-letter assignment across as many permutations as there are legal moves and sums the token probabilities, so the selected move reflects the cards instead of the label.

**Two prompting strategies.** Cloze prompting scores each legal action as a single-token completion. Counterfactual prompting asks whether a specific move is good or bad and takes the difference in probabilities. Cloze was more consistent across models.

**Scaling to 70B.** Small models run on one GPU. The 70B model needed DeepSpeed tensor parallelism across multiple GPU nodes under SLURM. That support is an optional `[distributed]` install extra so single-GPU users do not have to carry the dependencies.

## Reproducing the results

The evaluation harness is in a companion repo, [llm-uno-experiments](https://github.com/yagoromano/llm-uno-experiments), which is the reproducibility code cited in the paper. It holds the benchmark scripts, the per-model prompt templates for Llama 8B, Llama 70B, and Mistral 24B in both prompting variants, and the launch configs for running against local Hugging Face models, DeepSpeed-sharded models under torchrun and SLURM, or hosted models through OpenRouter.

Keeping it separate keeps `llm-uno` itself lightweight and installable while the experiments repo can accumulate cluster scripts and result logs.

![Benchmark of cloze versus counterfactual prompting win rates across four model sizes in UNO](/covers/llm-uno-experiments.svg)

## What I took away

Pretrained LLMs play a structured game competently with no fine-tuning, but cooperative assistance is a separate capability and scale only partly buys it. Most of the engineering was in the interface: turning game state into prompts, and turning model output back into legal moves.
