---
title: "CARLA Adversarial Braking"
description: "Research code behind a first-author IEEE ISCAS 2025 paper on defending autonomous vehicles against camouflaged adversarial attacks, built on CARLA and ROS 2."
repoUrl: "https://github.com/yagoromano/carla-adversarial-braking"
tags: ["Python", "Adversarial ML", "ROS 2", "Simulation"]
cover: "/covers/carla-adversarial-braking.svg"
order: 1
featured: true
badge: "IEEE ISCAS 2025"
badgeTone: "paper"
outcome: "Attacked stop sign at 85 km/h · 10 m overshoot · two defenses restore safe stopping"
paper:
  title: "Mitigation of Camouflaged Adversarial Attacks in Autonomous Vehicles: A Case Study Using CARLA Simulator"
  venue: "IEEE International Symposium on Circuits and Systems (ISCAS) 2025"
  authors: "Yago Romano Martinez, Carter Brady, Abhijeet Solanki, Wesam Al Amiri, Syed Rafay Hasan, Terry N. Guo"
  url: "https://arxiv.org/abs/2502.05208"
---

## What it is

The research codebase behind my first-author paper at IEEE ISCAS 2025. It covers both sides of the problem: how camouflaged adversarial attacks fool an autonomous vehicle's camera perception, and what defenses keep the vehicle braking correctly anyway. Everything runs in the CARLA simulator.

## The attack

Most published attacks on traffic sign recognition use stickers or projected light, which a human driver can often notice. This one re-textures the stop sign at the asset level so the change blends into the sign itself.

That texture is enough to degrade the YOLOv8 detector well below its clean-image confidence. The safety consequence is direct: at 85 km/h, the vehicle detected the attacked sign too late and ended up roughly 10 meters past the stop line instead of stopping at it.

## The defenses

Two countermeasures, both implemented and measured:

**Distance-aware braking** estimates the distance to the sign from its bounding-box height and the camera's focal length, then scales braking force against current speed so the vehicle can still stop in the shortened window.

**Side-camera sensor fusion** adds a second camera that triggers full braking on detection, so a compromised front camera is no longer a single point of failure.

With either defense active the vehicle stopped safely before the sign again, and the result held across multiple CARLA towns with the sign placed at different distances from the road.

## How it is built

The system runs as ROS 2 nodes on top of the carla-ros-bridge. A YOLOv8 perception node subscribes to the ego vehicle's camera feed and publishes detections, a control node turns those detections into braking decisions, and separate attack and defense nodes inject adversarial input and implement the countermeasures. Everything is visualizable live in RViz, which made iterating faster than reading logs.

## Beyond the paper

After the ISCAS work I extended the repo past camera-only perception:

- LiDAR object detection and clustering on point clouds
- LiDAR and camera fusion for distance estimation
- A control node driven by LiDAR distance with HMAC-based message integrity checks, plus a spoofing node that injects false LiDAR distances to test robustness

## What I took away

Adversarial robustness looks different at the system level than at the model level. A perception model that gets fooled in isolation can still be survivable if the control stack cross-checks it against another sensor. Building and measuring those cross-checks was the point.
