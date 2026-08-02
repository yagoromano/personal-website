---
title: "Snake AI (Dyna-Q)"
description: "Classic Snake game implemented with the Dyna-Q reinforcement learning algorithm."
repoUrl: "https://github.com/yagoromano/snake-ai-dyna-q"
tags: ["Python", "Reinforcement Learning"]
cover: "/covers/snake-ai-dyna-q.svg"
order: 5
meta: "Reinforcement Learning"
---

## What it is

A reinforcement learning agent that teaches itself to play the classic Snake game using Dyna-Q, a hybrid of model-free Q-learning and model-based planning. The agent's goal is simple: eat as much food as possible without crashing into walls or its own body.

## Why Dyna-Q

Plain Q-learning only learns from moves the agent actually makes, which is slow when useful experiences are rare. Dyna-Q adds a planning step: the agent builds a model of the environment from real experience, then replays simulated transitions from that model between real moves. Each real step turns into many learning updates, which speeds up and stabilizes training.

## How it is built

The environment is a custom Snake implementation written from scratch in Python, with no game framework dependencies for the core logic. Two entry points cover the two ways you would want to use it:

- `snake.py` trains and evaluates the agent headlessly, tracking reward and food collected per episode and plotting learning curves.
- `snake_game.py` runs the same algorithm with a Pygame display, so you can watch the snake go from random flailing to deliberate pathing in real time.

Hyperparameters like the learning rate, discount factor, exploration rate, and number of planning steps are all exposed for easy tuning.

## What I took away

This made the exploration-exploitation tradeoff and the value of model-based planning concrete. Running the same agent with zero planning steps versus fifty shows why the planning step matters more clearly than any explanation.
