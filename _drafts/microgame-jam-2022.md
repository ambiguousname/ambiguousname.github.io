---
---
Howdy folks!

This is long overdue, but a looooooot of stuff got in the way.

First thing's first, play the game [here](https://game-design-art-collab.itch.io/microgame-jam-2022). You can view the source code for all of what I'm about to discuss [here](https://github.com/GDACollab/Microgame-Jam-GHGT-Framework)

And as some optional reading, you can check out how we did it for the [year prior]({% post_url 2022-02-12-microgame-jam %}).

# The New System
Using Unity for the first year... kinda sucked. There was no good way to ensure consistency between exported projects, which was the main problem. Because of this lack of consistency, a lot of time was spent debugging, fixing the framework, and updating the extension to make sure everyone's games could sorta work okay.

Never again. The new system has to (on top of switching between games and passing information back and forth between them):
1. Keep game information contained and separate.
    a. Basically like a bunch of virtual machines. So we don't have ANY overlap between games and we don't have to tweak settings per-game so that the whole build looks okay.
    b. This is the most important thing, because otherwise it means a lot more debugging work for the system.
2. Ensure builds are consistent.
    a. If anything goes wrong with building the game, it should NOT be our system's fault. It's all up to the developers and how they make their games.
    b. This doesn't just include where the games are building to, but also that they all have the same display resolution.
3. Be as low-maintenance as possible.
    a. So again, if something goes wrong it's less likely to be our system.
    b. If this works right, it means we don't have to touch or debug the games. It's more of the jammer's fault if something goes wrong.
4. Easily testable
    a. This one was really hard to get right, and it's definitely not perfect in this iteration.

So, there were two possible ways I saw of going about this. Either:

1. Build to HTML/JS
    a. HTML/JS/WASM and/or WebGL is widely supported by practically every popular game engine and web browser under the sun.
    b. Slower performance for resource-heavy games (which is actually desirable for encouraging Microgames)
2. Build to a standardized format in say, Unix to get Docker (or something similar) run the games.
    a. Adds a lot more support for game engines, since making an executable is theoretically easier.
    b. Much harder to set up.

And I'm sure I would have pleased a lot of nerds if I went with the Docker solution, since it could be argued to be cooler and more interesting. And I know that web browser games have a reputation. Javascript and HTML especially. But I'm a developer, and I get to choose what frameworks I want to use. And I'm not going to make more work for myself just to score nerd credit. Plus, I think we ended up doing some pretty cool stuff here. Let me break it down.

## Iframes

HTML has the magic solution already. iframes. This just tells your browser to run another webpage inside of the one you're already in. Now, browsers are very persnicketty and panicky about iframes since you can theoretically use them for malicious purposes if the stars of web security don't align just right. So there are a lot of restrictions on how and why you can use iframes, and a lot of that can depend on the server you're running.

In my testing on itch.io though, I discovered that as long as you package all the games into one folder, then the server and the browser don't freak out about Cross Origin Resource Sharing.

So we can display games. Now we just have to communicate with them.

## Game Interface
A [lot](https://docs.godotengine.org/en/3.3/classes/class_javascript.html) [of](https://www.construct.net/en/make-games/manuals/addon-sdk) [game](https://docs.unity3d.com/Manual/webgl-interactingwithbrowserscripting.html) [engines](https://manual.yoyogames.com/The_Asset_Editors/Extensions.htm) actually support being able to execute code in the browser for builds, and that's very useful indeed. And even if they don't, as long as they build to web it's still very much possible to rip out the guts and hack together something that functions similarly (it takes a lot of work, but it's theoretically doable).

So, if we let the games be the ones to grab information from the overall game manager, then we have a solution that checks pretty much all the boxes we need for this solution. We can just build a singleton (or a close approximation of one) in the browser for each game engine to access with a custom-built extension or plugin we can provide to each of the jammers. And that's it!

gameinterface.js is the main component for interacting with the games. It communicates between the framework and is called by the games to act as the source of information for:

1. The number of lives
2. The current difficulty
3. The time left
4. The function to win the game
5. The function to lose the game
6. The function to start the game (should be called by the extension, not anything else)
    a. This is a requirement, since we need to know when the game is loaded. Unfortunately, it makes this just the tiniest bit harder to test.
7. The function to set the max timer for the game
8. A few other construction functions for setup that the extensions don't really need to access (so they don't)

And that's it! The overall manager itself is expected to do management things like switch between games and automatically lose if time runs out (this code is in version-style.js due to poor decision making on my part. We'll get to that in a bit).

### PICO-8
PICO-8 was interesting to build an extension for because it doesn't necessarily have Javascript code execution built-in. HOWEVER! PICO-8 aims to simulate a console, and so has virtual "pins" that you can use both in PICO-8 and access from Javascript. So we just need one extra script (picointerface.js) on the browser side to detect if PICO-8 is running and communicate back and forth between the game interface.

## Making the framework
So yeah! We cranked out the extensions over the summer, and the rest of the work had to be making sure that the web framework around everything would work just fine.

This is where we really overshot in terms of scope.

# The Bad

## The Rules

## Security Risks
Yeah, so just passing games control of browser execution is not a great idea. If you were hoping to make a gigantic game jam and collect everyone's games to automatically compile into one big game... probably a bad idea. It's still the same amount of risk you might see on itch.io (or other game distribution sites) for people publishing viruses. But still. If this is something you're interested in doing yourself, do it with people you trust.

## config.ini
Ughhhh, probably the worst part of this project.