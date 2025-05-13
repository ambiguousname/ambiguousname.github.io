---
layout: post
title: Porting Oblivion's Terrain to Minecraft
---

The Oblivion Remaster has ensorceled me<!--more-->[^oblivion]. As [some](https://www.pcgamer.com/games/the-elder-scrolls/hot-damn-the-oblivion-remaster-is-125-gb-2600-percent-heavier-than-the-original-game-from-2006/) [headlines](https://www.polygon.com/news/562217/the-elder-scrolls-4-oblivion-remastered-released) mention, there is no remake of the game's core data. Unreal Engine 5 is handling most of the rendering, while Gamebryo . Underneath *all* of these intersecting game engines, there are still the core `.esm` and `.esp` files.

[^oblivion]: After I finished playing Skyrim, along with finishing ALL of the DLCs, I tried turning back to Oblivion. I couldn't really make it work, as it just felt so different from Skyrim that going back-to-back on Elder Scrolls titles didn't feel great. The Oblivion Remaster gave me a handy excuse to revisit all of this.

As you may or may not remember [from last time]({% post_url 2024-12-17-skyrim-in-minecraft %}), `.esm` files are the beating hearts of design and experience. Without them, there are no quests, factions, weapons, armor, cities, dungeons. No terrain.

For that reason, there exists blood, sweat, and tears in each and every file. Every byte a product of a secret, quiet toil. My thanks go out to all of Bethesda's designers on this thing, and I promise nothing but respect for your labor. We will seat this Sisyphean effort, this ring of power, this `Oblivion.esm` file in a promenade of celebration raucous.

Chicken Jockey. Minecraft. You get it.

## Bringing Oblivion's Terrain to Minecraft
It would be kind of boring just to add support for Oblivion, so I will also be going over all the improvements that I made compared to [my previous post]({% post_url 2024-12-17-skyrim-in-minecraft %}).

Our starting point is the project still called [`Skyrim2Minecraft`](https://github.com/ambiguousname/Skyrim2Minecraft). It remains unchanged because I'm lazy.

### Differences in `Skyrim.esm` and `Oblivion.esm`

### Miscellaneous Improvements
It used to take me 45 minutes (or longer) to run the program on Skyrim's data, now it takes about 4 minutes. The project now uses [rayon](https://docs.rs/crate/rayon/latest) for some quick and dirty parallellism.

## Wrapping Up

### Future Improvements
- Profiling and improving Chunk writing speeds

So it should be pretty clear by now, this terrain format is not exclusive to Skyrim. Oblivion has it, Morrowind has it and, somewhat surprisingly, [The Elder Scrolls Adventures: Redguard](https://en.uesp.net/wiki/Mod:World_Files) has something similar. As I also mentioned in the last post, the 3D Fallout games also use this file format. With additional support for Oblivion's file format (and some light modifications to the existing code), we now have support for Fallout 3 *and* Fallout New Vegas. TODO: Actually do this.

## Epilogue

Watch out Fortnite, you're next.