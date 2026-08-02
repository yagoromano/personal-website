---
title: "DCGAN on CelebA"
description: "Deep Convolutional GAN in TensorFlow trained on CelebA to generate realistic human face images."
repoUrl: "https://github.com/yagoromano/dcgan-celeba"
tags: ["Python", "TensorFlow", "Generative Models"]
cover: "/covers/dcgan-celeba.svg"
order: 4
meta: "TensorFlow"
---

## What it is

A Deep Convolutional GAN (DCGAN) trained on the CelebA dataset to generate realistic human face images from random noise. Implemented in TensorFlow and Keras as a single Jupyter notebook for clarity and reproducibility.

## How it works

Two networks train against each other. The generator maps random noise vectors to images through a stack of transposed convolutions, while the discriminator, a convolutional classifier, learns to tell real CelebA faces from generated ones. Each network's improvement forces the other to get better, and over training the generator's outputs move from static-like noise toward recognizable faces.

## Design choices

- Single notebook, so the full pipeline from data loading to generated samples reads top to bottom.
- Runs on Google Colab or any GPU environment with no local setup.
- Samples the generator at fixed intervals during training, which makes mode collapse and instability visible directly instead of buried in loss curves.

## What I took away

GAN training is unstable, and this was a hands-on lesson in why. Balancing the two networks, picking the normalization and activation details, and reading generated samples as a debugging signal mattered as much as the architecture itself.
