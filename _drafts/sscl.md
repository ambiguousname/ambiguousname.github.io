---
layout: post
title: "What I Did and How It Works: Sea Star Crossed Lovers"
---

Before we start, you should play [Sea Star Crossed Lovers](https://seagda.itch.io/sscl). Unlike Gremlin Garden (also release by GDA in the same year), the Itch.io page doesn't
include a link to the source code, but you can see the source code [here](https://github.com/GDACollab/SeaStarCrossedLovers).

Okay, so I did a lot of miscellaneous programming for Sea Star Crossed Lovers, meaning that for most of my work, I can't really go in depth in a fun or interesting way.

Except for the waves, which were pretty fun to make.

## The Waves

First thing's first, I didn't actually make the code for the passive waves the go on while you're playing the game normally. I used [this tutorial](https://rafalwilinski.medium.com/tutorial-particle-sea-in-unity3d-70ff1350fa9e) by Rafal Wilinski, which goes into how to generate waves using Unity's particle system and perlin noise. I converted the particle sea algorithm into 2D, and so I was left with this.

IMAGE

But of course, I needed the sea to actually be "filled in", so the sea could actually have a texture and look believable. I tried a few experiments using Unity's line component.

IMAGE

That got me part of the way there, but it wasn't really the right tactic. I would have to use...

## CALCULUS

I love calculus. I know it's not everybody's favorite subject, but... I love calculus. In case you don't love calculus, I'll try to make my problem solving process clear to you.

Alright, here's our sea. Right now, it's represented by a bunch of points, like so.

IMAGE

We want it to look like this:

IMAGE