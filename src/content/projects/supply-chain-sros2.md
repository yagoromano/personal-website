---
title: "Supply Chain Exploitation of Secure ROS 2"
description: "A co-first-author IEEE MILCOM 2025 proof of concept: a trojanized Secure ROS 2 package that steals keystore credentials over DNS and hijacks a real autonomous vehicle."
tags: ["ROS 2", "Cybersecurity", "Supply Chain", "Autonomous Vehicles"]
cover: "/covers/supply-chain-sros2.svg"
order: 3
featured: true
badge: "IEEE MILCOM 2025"
badgeTone: "paper"
outcome: "Keystore exfiltration over DNS · 60 Hz spoofing on a physical Quanser QCar2"
paper:
  title: "Supply Chain Exploitation of Secure ROS 2 Systems: A Proof-of-Concept on Autonomous Platform Compromise via Keystore Exfiltration"
  venue: "IEEE Military Communications Conference (MILCOM) 2025"
  authors: "Tahmid Hasan Sakib, Yago Romano Martinez, Carter Brady, Syed Rafay Hasan, Terry N. Guo"
  url: "https://arxiv.org/abs/2511.00140"
---

## What it is

A co-first-author MILCOM 2025 paper. To our knowledge it is the first practical supply chain attack aimed specifically at Secure ROS 2 (SROS 2), the security layer robots use to authenticate and encrypt the messages passing between their components.

The point is that if you can compromise the package a team installs to set that security up, the protection it is supposed to provide can be turned against them. We demonstrated it end to end on a real Quanser QCar2 autonomous vehicle.

## How the attack works

SROS 2 roots its trust in a keystore: the certificates, private keys, and policy files generated when an operator runs the `ros2 security` commands. Whoever holds a copy of that keystore can pose as a legitimate participant on the network, because SROS 2 trust is identity-based rather than tied to a specific machine.

The attack targets the moment those credentials are created:

- **A trojanized package.** A tampered Debian package replaces the official ROS 2 security utilities with modified versions. The interface is unchanged, so it behaves normally after install, and the malicious logic is compiled into Cython extension objects to make casual inspection harder.
- **Exfiltration over DNS.** When an operator generates their keystore, the payload reads the new keys and policy files, base64-encodes them, splits them into chunks small enough to fit inside DNS query labels, and sends them to an attacker-controlled DNS listener. DNS is used because it is ubiquitous and rarely inspected, so the theft blends into normal traffic and needs no elevated privileges or extra processes.
- **Reassembly and impersonation.** The attacker reorders the chunks, rebuilds the keystore, and rejoins the secure network as an authenticated node. From there, standard DDS behavior does the rest: multiple publishers are allowed per topic, so the attacker can override legitimate messages.

## End-to-end impact

On the QCar2 running a four-stop-sign navigation routine, credential theft alone was enough to take over the vehicle. Injecting spoofed messages at 60 Hz on the control and perception topics produced forced braking on a clear path, sudden full-throttle acceleration, abrupt steering and path deviation, premature stops, and a suppressed stop-sign detection that caused the car to run a stop it should have caught. Each was a distinct, reproducible failure mode traced from the injection to the physical outcome.

## Why it matters

Turning security on is not the same as being secure if the tooling that provisions that security cannot be trusted. The paper argues for defense on two fronts: hardening the software supply chain itself (reproducible builds, code signing, package-hash verification, isolated build pipelines) and adding runtime semantic validation so a subscriber rejects physically implausible commands even when they come from an authenticated sender. The technique applies to any DDS-based robot that relies on SROS 2, not just the platform we tested.
