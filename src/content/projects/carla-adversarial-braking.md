---
title: "CARLA Adversarial Braking"
description: "Research code behind a first-author IEEE ISCAS 2025 paper on defending autonomous vehicles against camouflaged adversarial attacks, built on CARLA and ROS 2."
repoUrl: "https://github.com/yagoromano/carla-adversarial-braking"
tags: ["Python", "Adversarial ML", "ROS 2", "Simulation"]
cover: "/covers/carla-adversarial-braking.svg"
order: 1
paper:
  title: "Mitigation of Camouflaged Adversarial Attacks in Autonomous Vehicles: A Case Study Using CARLA Simulator"
  venue: "IEEE International Symposium on Circuits and Systems (ISCAS) 2025"
  authors: "Yago Romano Martinez, Carter Brady, Abhijeet Solanki, Wesam Al Amiri, Syed Rafay Hasan, Terry N. Guo"
  url: "https://arxiv.org/abs/2502.05208"
---

## What it is

The research codebase behind my first-author paper at IEEE ISCAS 2025. The project studies how camouflaged adversarial attacks can fool an autonomous vehicle's camera-based perception, and evaluates defenses that keep the vehicle braking correctly anyway, all inside the CARLA simulator.

## The attack

Rather than stickers or projected light, which a human driver can often spot, the attack re-textures the stop sign itself at the asset level so the change blends into the sign. That texture is enough to degrade the YOLOv8 detector: in testing, detection confidence dropped well below the clean baseline. The safety consequence is concrete. At 85 km/h, a car facing the attacked sign detected it too late and rolled roughly 10 meters past the stop line instead of halting at it.

## The defenses

The paper implements and measures two countermeasures:

- **Distance-aware braking** computes the distance to the sign from its bounding-box height and the camera's focal length, then scales braking force against the car's current speed so it can still stop in the shortened window.
- **Side-camera sensor fusion** adds a second camera that triggers full braking on detection, so a compromised front camera is no longer a single point of failure.

With either defense active, the car stopped safely before the sign again, and the result held across multiple CARLA towns with the sign placed at varying distances from the road.

## How it is built

The system runs as a set of ROS 2 nodes on top of the carla-ros-bridge:

- A YOLOv8 perception node subscribes to the ego vehicle's camera feed and publishes detections.
- A vehicle control node turns those detections into braking decisions.
- Attack nodes inject camouflaged adversarial inputs to stress the perception pipeline, and defense nodes implement the countermeasures above.

Everything is visualizable live in RViz, which made iterating on attack and defense behavior much faster than log-diving.

## Beyond the paper

After the ISCAS work, I extended the repo with sensor-fusion and security experiments that go past camera-only perception:

- LiDAR object detection and clustering directly on point clouds.
- LiDAR and camera fusion for distance estimation.
- A control node driven by LiDAR distance with HMAC-based message integrity checks, plus a spoofing node that injects false LiDAR distances to test robustness against adversarial sensor input.

## What I took away

Adversarial robustness looks very different at the system level than at the model level. A perception model that is fooled in isolation may still be survivable if the control stack cross-checks it against another sensor, and this project was about building and measuring exactly those cross-checks.
