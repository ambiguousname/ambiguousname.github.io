---
layout: post
title: "What I Did and How It Works: The Microgame Jam"
order: 
---

Play the [Microgame Jam](https://game-design-art-collab.itch.io/speed-and-size) if you haven't already, it'll provide important context!

You can view the source code for the jam [here](https://github.com/GDACollab/Microgame-Game-Jam).

As project lead for the Microgame Jam, I did a whole lot, but most of my time and effort went into getting all of the games to work together. And debugging. I did a whole lot of debugging. Let's first talk about the fundamentals though:

## The Game Controller

Games in the Microgame Jam are set up as .unitypackages. A participant in the Microgame Jam would make their game in Unity, and then export ALL the assets for that game to a .unitypackage, and I would import all of their games using some Unity scripts I had set up. But we also needed a way to pass information along games. I mean, you can't have minigames of wildly different difficulty levels, right? How can we tell if a minigame is over? And what happens if a player fails three games in a row? What's the score going to look like? That's where The Game Controller comes in.

There are two Game Controllers:
1. The Development Game Controller, which is provided in a .unitypackage and used by Microgame developers to test the functions and variables of the actual Game Controller while they're working.
2. The actual Game Controller, which is the version used in the final game. This contains ALL of the functionality needed to transition between games, tweak difficulty settings, track lives, whatever is needed from it.

Both GameControllers work as an instance of a Singleton, of which there can only be one instance that works across all games. That way, there's consistency of whatever variables the Game Controller needs to track across games. Any script can call GameController.Instance.WinGame() or GameController.Instance.LoseGame() in order to signal that the game is over, and any script can get GameController.Instance.difficulty to get the current difficulty setting. 

At least, that's how it was supposed to work in theory. Some developers didn't understand the Singleton concept, so I had to adjust their code when it was imported. To make matters worse, we got the Singleton code from online somewhere (the source is in the Singleton.cs file on the Github), and it was riddled with weird peculiarities that made implementing the Singleton slightly more difficult, like the fact that we could create multiple copies of the Game Controller Singleton (the purpose of a Singleton is that it is meant to be unique).

Peculiarities regardless, we had the Game Controller set up, but there were a few things bugging us about the transitions between games. So I delved into the nightmare that is

## Asynchronous Loading

When you play a collection of microgames, you don't want to have to look at a loading screen while Unity loads in the next game. You want to see a funny animation, and then start playing right away. That's where asynchronous loading comes in. While you're playing through there's also part of the game that's dedicated to loading the next minigame.

Additionally, most people play games on the web, and asynchronous loading is a great way to make sure that they get into playing FAST.

So, I created a quick system to load in the games. Easy, right? While Game #1 is playing, load Game #2 in the background. When Game #1 is done, load Game #2. ADFSFKJSDF

## Things to improve

I already have a list of things I want to improve, and here they are:

1. If I had to use this format again, I probably would do as much as I could to avoid yet more conflict. If we're all being honest, people have trouble following directions, and it was my fault that I did not minimize the amount of directions and guidance we had to give them. Let the games do as much of their own thing as possible, focus only on loading them.

2. The amount of playtesting after we made the switch to asynchronous game loading was somewhat abysmal, so I have learned my lesson to always always always start playtesting after major changes.

3. This whole process was also before I knew test-driven development was a thing. A lot of the debugging problems could have probably been prevented if I had constructed some rigorous stress-tests on the level loading.

4. I realize a lot of my documentation relies on comments. This is good for smaller scripts, not so for larger projects. True, Visual Studio's summary tags are incredibly useful, but having a comprehensive document is even more useful for anyone looking to contribute to the project. I doomed myself to more work because I was the only one who understood the project well enough to debug it.

5. For those of you who may have browsed my Github, you might have noticed I submitted a game to the Microgame Jam WHILE the jam was in progress. "This'll be easy," I thought, "I can help coordinate the jam and write a game for it really quick!" I won't say I was wrong, but I wasn't exactly right either. No more participating in events WHILE I'm organizing them.

With all of this in mind, I have some pretty great improvements in mind. For those, you'll just have to wait and see.