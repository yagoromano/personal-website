---
title: "LLM UNO"
description: "An installable RLCard extension that lets decoder-only LLMs play UNO as agents, from single-GPU models to distributed 70B inference. Basis for a first-author IEEE ICMLA 2025 paper."
repoUrl: "https://github.com/yagoromano/llm-uno"
tags: ["Python", "LLM Agents", "RLCard", "Distributed ML"]
cover: "/covers/llm-uno.svg"
order: 4
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

## What I took away

The honest result is the valuable one: pretrained LLMs are capable solo players in a structured game with zero fine-tuning, but reliable cooperative assistance is a distinct and harder capability that scale only partly buys. Getting there was as much an interface problem as a modeling one, since most of the engineering lives in turning game state into prompts and model output back into legal moves.
