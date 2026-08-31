---
title: "GUI Agent Benchmark and RL Environment"
description: "An internal platform at HCA Healthcare that containerizes a full Linux desktop to evaluate multimodal VLM agents on real enterprise workflows, later extended into a reinforcement learning training environment."
tags: ["Python", "Docker", "VLM Agents", "Reinforcement Learning", "NeMo RL"]
cover: "/covers/gui-agent-benchmark.svg"
order: 0
featured: true
outcome: "Containerized Linux desktop · deterministic checkpoint scoring · NeMo RL rollouts"
---

## What it is

An internal benchmark platform I built at HCA Healthcare for evaluating multimodal vision-language model agents. These are agents that get a goal in plain language and have to accomplish it by operating a computer directly, clicking, typing, and reading the screen the way a person would.

It later became a reinforcement learning environment for training those agents, not just scoring them.

## Why containerize a full desktop

The cheaper approach is to evaluate agents against a browser alone, or against mocked interfaces. Neither holds up. Real work moves between web apps, native desktop applications, file dialogs, and overlapping windows, and an agent that only ever sees isolated pages never has to handle the parts that make the task difficult.

Running a full Linux desktop in Docker covers three requirements at once. Every run starts from an identical clean state, so results reflect the agent instead of leftover state from the previous attempt. Environments are disposable and can run many at a time, which matters once you are doing training rollouts instead of single evaluations. And because it is a real desktop, tasks can span applications the way they do in practice.

## Scoring

An easy option is to grade runs by asking another language model whether the task looks complete. It is fast to build and unreliable. The judge has its own failure modes, its verdicts shift between runs and between model versions, and you end up debugging the grader instead of the agent.

Tasks are scored against deterministic checkpoints instead, concrete verifiable conditions about the resulting state. The same trajectory always produces the same score, which is what you need before comparing two agents or two versions of the same agent. Every run also logs its full trajectory, which turns a pass or fail into something you can diagnose, and which became the training data later.

## Perception: DOM where available, pixels where not

Agents cannot act on what they cannot perceive, and the right method depends on what is on screen.

Browser tasks expose a DOM, which gives precise structured element boundaries cheaply. Native desktop applications have no DOM, so the system falls back to OCR over the rendered screen. Neither covers the full surface alone. The hybrid is what lets one agent move between a web app and a native window inside a single task without the harness losing track of what is on screen or where it can click.

## From evaluation to training

A good evaluation environment is most of a training environment already, since both need a resettable world, a reliable reward, and a faithful observation of state.

I extended the platform into an RL environment integrated with NVIDIA NeMo RL: sandboxed rollouts running in parallel, reward signals shaped around task structure rather than a single terminal success bit, and continuous screenshot observations fed back so the agent sees the result of each action before choosing the next one. That last part matters. An agent that only observes the world at the start of an episode is guessing, while one that sees the interface update after every action can correct course.

## Data governance assistant

Alongside the benchmark work I built and deployed a context-aware data governance assistant embedded in a production enterprise web app. It answers natural language questions through grounded SQL retrieval rather than free generation, keeps multi-turn session memory so follow-up questions work as expected, routes questions by intent, and can set dashboard filters directly from a plain-language request.

Grounding matters here for the same reason deterministic scoring does above. In a governance context a confident wrong answer is worse than no answer.

## What I took away

The hard part of agent work is usually not the model. It is building an environment honest enough that the numbers mean something, then keeping it honest once it turns into a training loop. Deterministic state, verifiable rewards, and faithful observation are what separate a benchmark you can make decisions from and one that just produces plausible numbers.
