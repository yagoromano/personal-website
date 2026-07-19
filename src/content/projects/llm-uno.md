---
title: "LLM UNO"
description: "An installable RLCard extension that lets decoder-only LLMs play UNO as agents, from single-GPU models to distributed 70B inference. Basis for a first-author IEEE ICMLA 2025 paper."
repoUrl: "https://github.com/yagoromano/llm-uno"
tags: ["Python", "LLM Agents", "RLCard", "LLM Evaluation", "Distributed ML"]
cover: "/covers/llm-uno.svg"
order: 2
paper:
  title: "LLMs as Agentic Cooperative Players in Multiplayer UNO"
  venue: "IEEE International Conference on Machine Learning and Applications (ICMLA) 2025"
  authors: "Yago Romano Martinez, Jesse Roberts"
  url: "https://arxiv.org/abs/2509.09867"
---

## What it is

A pip-installable Python package that extends RLCard, the card-game reinforcement learning toolkit, so decoder-only large language models can play UNO as agents. It is the codebase behind my first-author ICMLA 2025 paper, which asks a question most game-playing LLM work skips: not can a model win, but can it act as a non-player character that helps someone else win.

## The two questions the paper answers

The work studies two settings across four models (LLaMA-3.2-1B, LLaMA-3.1-8B, Mistral-24B, and LLaMA-3.3-70B), two prompting strategies, and 10,000 games per configuration.

- **Autonomous play:** the LLM competes head-to-head against a random agent. Every model cleared the random baseline with statistical significance under at least one prompt, and Mistral-24B topped out at a 52.1% win rate with cloze prompting, close to what RLCard's trained DQN agent achieves, with no fine-tuning at all.
- **Cooperative play:** the LLM sits in a third seat and is told to help a rule-based teammate win rather than win itself. This is where it gets interesting. Solo competence did not transfer. Against a 35.0% unassisted baseline, only LLaMA-3.3-70B with cloze prompting crossed the significance threshold; the rest landed near it but short. Being good at a game turns out to be a poor predictor of being good at helping someone else at it.

## Engineering details worth calling out

- **Correcting for token bias.** Small models have a base-rate preference for whichever option is labeled "A", independent of the actual game state. The agent counters this by rotating the action-to-letter assignment across as many permutations as there are legal moves and summing token probabilities, so the choice reflects the cards rather than the letter.
- **Two prompting strategies.** Cloze prompting scores each legal action as a single-token completion; counterfactual prompting asks the model whether a specific move is good or bad and takes the probability difference. Cloze was the more consistent winner across models.
- **Scaling to 70B.** Small models run on one GPU; the 70B model needed DeepSpeed tensor parallelism across multiple GPU nodes under SLURM, which the package supports through an optional `[distributed]` install extra so single-GPU users are not forced to carry that dependency weight.

## Reproducing the results

The full evaluation harness lives in a companion repo, [llm-uno-experiments](https://github.com/yagoromano/llm-uno-experiments), the reproducibility code cited in the paper. It holds the runnable benchmark scripts, the per-model prompt templates (Llama 8B, Llama 70B, Mistral 24B, in both cloze and counterfactual variants), and the launch configs for running agents against local Hugging Face models, DeepSpeed-sharded models across nodes via torchrun and SLURM, or hosted models through OpenRouter. Keeping it separate from the core package keeps `llm-uno` itself lightweight and installable while the experiments repo can freely accumulate cluster launch scripts and result logs.

The headline comparison it produces is the win rate of each model under both prompting strategies against the random baseline:

![Benchmark of cloze versus counterfactual prompting win rates across four model sizes in UNO](/covers/llm-uno-experiments.svg)

Comparing the same game across prompting strategies made the differences concrete: cloze scoring is cheap and consistent, while counterfactual prompting trades tokens for more deliberate play. Building the harness to make those comparisons repeatable was as much of the work as the agents themselves.

## What I took away

The honest result is the valuable one: pretrained LLMs are capable solo players in a structured game with zero fine-tuning, but reliable cooperative assistance is a distinct and harder capability that scale only partly buys. Getting there was as much an interface problem as a modeling one, since most of the engineering lives in turning game state into prompts and model output back into legal moves.
