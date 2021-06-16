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

![Waves as dots](/assets/images/sscl/wavedots.png)

But the sea isn't made out of dots, so to "fill in", or (in more professional terms) to create a mesh based on the particles in our sea, I turned to calculus. 

### CALCULUS

I love calculus. I know it's not everybody's favorite subject, but... I love calculus. Imagine that each particle in our particle sea is actually a point on a function that outlines our entire sea. 

![Dots with a line connecting them](/assets/images/sscl/wavevisualization.png)

All we have to do to generate our sea's mesh is to find the area under the curve between all of the points in our function. Now, luckily for us, there's a concept in calculus that fits quite neatly with drawing geometrical shapes under curves to find their area. [Riemann sums](https://en.wikipedia.org/wiki/Riemann_sum)! Imagine drawing a trapezoid in between each point, and shading it in. By drawing that trapezoid, we have found our area under the sea. Unity doesn't use trapezoids in drawing meshes (it uses triangles), so between each point in the sea are two triangles.

![Waves represented with triangles](/assets/images/sscl/wavetriangles.png)

And that's how you generate a wave to then texture with a mesh! If you're interested in the actual code that generates the mesh, you can view that [here](https://github.com/GDACollab/SeaStarCrossedLovers/blob/5ff95accde1a4d569a0b5c9efb9496f927d42ad8/Sea%20Star%20Crossed%20Lovers/Assets/Scripts/Tower%20Obstacles/Waves/Waves.cs#L173).

## Waves as Obstacles
The waves in Sea Star Crossed Lovers are more than window dressing, they'll sometimes come and knock over your tower. Unlike Calculus, I would have to use

##### PRECALCULUS (Which isn't as exciting as Calculus, which is why it's in this smaller font size)

The basic way the system works is that there's such a thing called a Disruptive Wave (which is a class, when it should have probably been a struct). When a Disruptive Wave is created, it gets added to an array of Disruptive Waves, and that array is evaluated every time the game also tries to simulate the motion of the sea. Each Disruptive Wave is treated as a segment of a sine/cosine wave that is then added on top of the existing particles based on how far the wave has moved along the sea.

![Illustration of how displacement waves work](/assets/images/sscl/wavedisplacement.png)

After the waves displace the particle system, they're then moved further along and eventually removed. Since the Disruptive Waves actually displace the particles upward, block collision is detected using Unity's own particle collision detection system (but I didn't write that part, so I won't go into depth on that).

If you're interested, the parameters for creating these waves are determined by [this equation](https://www.desmos.com/calculator/jgudrypofv) that I've replicated on Desmos, and the entirety of the waves code is [here](https://github.com/GDACollab/SeaStarCrossedLovers/blob/5ff95accde1a4d569a0b5c9efb9496f927d42ad8/Sea%20Star%20Crossed%20Lovers/Assets/Scripts/Tower%20Obstacles/Waves/Waves.cs) on Github.

## Regrets

There is one bug that I did not fix that is very irritating. If the top right of the waves mesh is out of view, the entirety of the waves will disappear. This probably has something to do with how Unity renders meshes, and if it were critical, I would have fixed it. Luckily, it was not critical, but it is irritating. I'd show you the bug in an image, but you can't really communicate invisibility visually. I'll try, though.

<p style="height: 10em;"></p>

Do you see it?

Bug regardless, I'm pretty proud of what I accomplished here.

Thank you for taking the time to read this, and remember that your fingers only wrinkle in water because our brains want them to.