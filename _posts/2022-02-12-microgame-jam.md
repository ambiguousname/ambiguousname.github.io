---
layout: post
title: "What I Did and How It Works: The Microgame Jam"
---

Play the [Microgame Jam](https://game-design-art-collab.itch.io/speed-and-size) if you haven't already, it'll provide important context!

You can view the source code for the jam [here](https://github.com/GDACollab/Microgame-Game-Jam).

As project lead for the Microgame Jam, I did a whole lot, but most of my time and effort went into getting all of the games to work together. And debugging. I did a whole lot of debugging. Let's first talk about the fundamentals though:

## The Fundamentals

Here's the quick overview for making a game and adding it to the Microgame Jam:

**Step One**: Import our GameController.unitypackage file.

**Step Two**: Make a game in Unity!

**Step Three**: In your Unity game, use the GameController class (imported from the GameController.unitypackage file) to get information about the state of the player. Like how many lives they have, what the difficulty should be, etc.

**Step Four**: When the game ends, call GameController.Instance.Win or GameController.Instance.Lose.

**Step Five**: You're done programming! Now export ALL the assets for that game to a .unitypackage file.

**Step Six**: Import the .unitypackage file into the master Microgame Jam Unity project.

From the developer's point of view, that's fairly easy, right? But there's a lot of stuff going on at the back end. For instance, how do we pass the information from one game to the other? Each minigame is a separate scene, so won't loading one minigame cause us to lose data from the other? What if a game doesn't call our GameController's Win function or Lose function? How do we store lives and pass that to each minigame? Let's talk about the implementation of GameController.

There are actually two Game Controllers:
1. The Development Game Controller, which is provided in a .unitypackage and used by Microgame developers to test the functions and variables of the actual Game Controller while they're working.
2. The Working Game Controller, which is the version used in the final game. This contains ALL of the functionality needed to transition between games, tweak difficulty settings, track lives, whatever is needed from it.

Both GameControllers work as an instance of a Singleton, of which there can only be one instance that works across all games. That way, there's consistency of whatever variables the Game Controller needs to track across games. Any script can call GameController.Instance.WinGame() or GameController.Instance.LoseGame() in order to signal that the game is over, and any script can get GameController.Instance.difficulty to get the current difficulty setting. 

Okay, so now that we have the Game Controller set up, here's the back-end process for getting all the games to work:

**Step Six**: Import the .unitypackage file from ALL the microgames.

**Step Seven**: Add all the scenes from the microgames into a master list of scenes to load on the fly.

**Step Eight**: When the game starts, create the GameController Singleton to store a universal count of lives, score, deaths, etc.

**Step Nine**: As the game runs, use a script to determine which scenes from the microgames to load. Load in each scene from the microgame as appropriate. Each microgame should have access to the singleton we made in Step Eight.

**Step Ten**: Play the games normally! We're done!

At least, that's how it was supposed to work in theory. Let's break down what went wrong with each of these steps.

## Step Six: Importing .unitypackages
Some developers forgot to submit their games with a .unitypackage. "It's fine," I thought, "this sort of thing happens." And it does. We quickly explained to all of the developers who failed to submit a .unitypackage that they needed to submit a .unitypackage, and we showed them how to do that.

And then when I did import all the .unitypackages, I saw a ton of file conflicts. One of the rules we specified during the Microgame Jam was that you should name your assets "GameName_AssetName" to avoid conflicts with any other files that might be similarly named from other games. "This is also fine," I thought, "We can just rename any file conflicts as they appear." And so we did. And it didn't turn out to be that bad. But it gets worse.

## Step Seven: Adding Scenes
One of the assumptions I made was that developers would typically stick to one scene. Oh no. One team decided that they'd like to have THREE scenes as part of their Microgame. So I had to make sure that only ONE of their scenes could be loaded during Step Nine. This didn't prove to be problematic at the time. You'll see this gets much worse during Step Nine, though.

## Step Eight: Creating the Singleton
Some developers didn't understand the Singleton concept. I saw some scripts where people were creating their own instance of GameController, or just calling the functions wrong. So for a lot of the Microgames, I had to go in and make sure that they were calling the Singleton functions correctly. This was more bothersome because: a lot more games had this issue, so I had to spend more of my time fixing simple function calls. So I had to adjust their code when it was imported.

## Step Nine: Loading in the scenes

Originally, the Microgame Jam build was loading in scenes synchronously. So any time you load a microgame, the entire game will pause and wait for that game to load. But someone suggested that we load in one microgame while the other was loading. We'd already had some difficulty getting this set up, but I thought "Hey, I can implement this, no problem!" So I delved into the nightmare that is

### Asynchronous Loading

When you play a collection of microgames, you don't want to have to look at a loading screen while Unity loads in the next game. You want to see a funny animation, and then start playing right away. That's where asynchronous loading comes in. While you're playing through there's also part of the game that's dedicated to loading the next minigame.

Additionally, most people play games on the web, and asynchronous loading is a great way to make sure that they get into playing FAST.

So, I created a quick system to load in the games. Easy, right? While Game #1 is playing, load Game #2 in the background. When Game #1 is done, load Game #2. Except no, because threads are the worst. As anyone who's ever tried to make one thing happen while doing another thing will tell you, "Run time errors suck, and I hate them. I hate them. I HATE THEM. DIE! DIE! DIE! DIE!"

I'm paraphrasing, but it's true. Asynchronous loading worked out for the first few test scenes I had set up, but both I and the developers of the microgames made things infinitely harder for me.

#### Problem One: Me. I made things worse.
Someone else, someone that wasn't me, made an animation in Adobe Illustrator to play during the transitions. If you play through the current build of the Microgame Jam, you'll even see it!

![Transparent transition](/assets/images/microgamejam/transparent.png)

The problem with this intro is that at the end, it's transparent (as you can see above). So the idea is:

1. You load into a game.
2. You play that game.
3. While that game is playing, you load another game.
4. Because of how Unity's scenes work, you have to deactivate everything in game that's loading, once it's done loading.
5. Then, when the current game is done, you start the transition scene.
6. When the transition scene is close to ending, show everything in the other game, but KEEP THE OTHER GAME PAUSED (I used Time.timeScale = 0).
7. When the transition scene is done, unpause the other game.

This was nightmarish to debug, mainly because Unity scenes are not designed to be loaded, unloaded, and then paused. You have to specifically set up the scripts in your scene to make sure it doesn't conflict with the script you're using for asynchronous loading. And guess what?

#### Problem Two: The Game Developers Made Things Worse (Stupid Unity-specific edge cases)
There's no accounting for the amount of features that someone will bring in to their game engine. You remember Step Seven, right? Where I mentioned that someone decided to add multiple scenes? That was a problem. The game had to transition in between scenes for those two extra scenes to load, and so all the other scenes were unloaded. Then when I fixed the loading code to be asynchronous, even more things broke.

Some games decided to create objects during the beginning of their scene. While this is a normal thing for Unity (It's the `Start(){}` function you get from every default Unity script), it absolutely broke how those scenes loaded in the Microgame Jam build. So I had to go in and fix everything manually.

This problem was so bad, it even interfered with

## Step Ten: Play the games normally

Ha ha, yeah...

The asynchronous code really messed things up. A lot of submissions ended up creating these weird edge cases that I always had to fix, and because I was making constant changes to the framework, it was not as solid as it was when I first tested it out.

To make matters worse, we got the Singleton code from online somewhere (the source is in the Singleton.cs file on the Github), and it was riddled with weird peculiarities that made implementing the Singleton slightly more difficult, like the fact that we could create multiple copies of the Game Controller Singleton (the purpose of a Singleton is that it is meant to be unique).

Basically, it's a bad idea to implement asynchronous loading if you're not 100% in control of what you're about to load. Step Nine was the worst thing by far because every time I fixed something wrong with one game, it typically ended up breaking how another game loaded. I eventually fixed most bugs, but it certainly left a delay in between the end of the jam and the release of the final build.

Oh, and don't give people access to a framework unless you're 100% certain it's working to your satisfaction. I've since learned about test driven development, and it's a much better alternative to "wait until something goes wrong, THEN fix it."

## Things to improve

I already have a list of things I want to improve, and here they are:

1. If I had to use this format again, I probably would do as much as I could to avoid yet more conflict. If we're all being honest, people have trouble following directions, and it was my fault that I did not minimize the amount of directions and guidance we had to give them. Let the games do as much of their own thing as possible, focus only on loading them.

2. The amount of playtesting after we made the switch to asynchronous game loading was somewhat abysmal, so I have learned my lesson to always always always start playtesting after major changes.

3. This whole process was also before I knew test-driven development was a thing. A lot of the debugging problems could have probably been prevented if I had constructed some rigorous stress-tests on the level loading.

4. I realize a lot of my documentation relies on comments. This is good for smaller scripts, not so for larger projects. True, Visual Studio's summary tags are incredibly useful, but having a comprehensive document is even more useful for anyone looking to contribute to the project. I doomed myself to more work because I was the only one who understood the project well enough to debug it.

5. For those of you who may have browsed my Github, you might have noticed I submitted a game to the Microgame Jam WHILE the jam was in progress. "This'll be easy," I thought, "I can help coordinate the jam and write a game for it really quick!" I won't say I was wrong, but I wasn't exactly right either. No more participating in events WHILE I'm organizing them.

With all of this in mind, I have some pretty great potential improvements. For those, you'll just have to wait and see (assuming we ever do this again).