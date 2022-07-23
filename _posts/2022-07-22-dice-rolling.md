---
layout: post
title: Everyone's Modelling Dice Wrong
img: /assets/images/dicebanner.png
updated: "07/23/2022"
---
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
I didn't think I'd ever make this post, but here we are.

Sure, it's been kicking around in the back of my head for a while, but now that the [GMTK Game Jam 2022](https://itch.io/jam/gmtk-jam-2022) is over, and its theme specifically deals with dice...

It's time we had a chat about representing dice accurately. Not everyone is guilty of this, especially if you've never modelled a die before. But there are some who, intentionally or not, misrepresent dice in their games. And you'd better hope that it was an accident, because if not, I'll be reporting you to the proper dice authorities.

## Dice Conventions

Let's get to the real meat of the issue: When making a die, there are official, proper, and nigh-immovable standards when it comes to the placement of faces and their orientation.

Well, not really. But there *should* be. There are a lot of dice to cover, but for the sake of this post (and since nearly everyone in the jam went with a d6 for their imagery), we'll discuss the d6[^1]. Here's a model of what your typical d6 should look like, based on the many d6s I just so happen to carry around with me at all times[^2]:

[^1]: For you non-dice nerds, xdy means x number of y sided dice.
[^2]: I carry roughly 100 six sided dice with me in a bag at all times, plus about 6 giant foam six sided dice, specifically to win arguments. And to play Liar's Dice. Liar's Dice is cool, and you should carry 100 six sided dice with you at all times in case you want to play it. Don't even get me started on the official ruleset for Liar's Dice, though.

<model-viewer alt="A REAL Six Sided Die" src="/assets/models/d6.glb" camera-controls disable-zoom style="width: 400px; height: 400px; margin-left: auto; margin-right: auto;"></model-viewer>

At any point, feel free to drag around this 100% accurately modelled d6 for your own demonstrative purposes. If you somehow don't trust the painstaking effort I took when crafting this die, feel free to sample as many d6s from your own collection[^collection] as possible to prove my point.

[^collection]: I assume you happen to keep a collection of d6s with you. If you don't happen to have many d6s with you, I would advise rectifying this problem by *immediately* driving to your local board game store and buying as many dice as possible from as many different manufacturers as you can. Personally, I prefer [Steve Jackson dice](http://www.sjgames.com/dice/), but *nearly* any dice manufacturer will get it right.

Speaking as an accredited expert in dice studies[^accredit], let's start with the most important aspect. Face placement. This is something that should apply to all dice, and not just d6s.

: For any die, two opposing faces on that die should sum to one more than the number of faces on the die.

[^accredit]: I'm not officialy accredited, I just happen to look at a lot of dice. That should nearly account for accreditation; not that any school I've furiously emailed has ever bothered to respond about adding a doctorate in dice studies.

You'll notice on any good d6, 6 and 1 are opposite each other[^3], same with opposing faces 5 and 2[^4], and 4 and 3[^5]. This is the <u>golden standard</u> for any die[^source] that has opposing faces.

[^3]: 6 + 1 = 7.
[^4]: 5 + 2 = 7.
[^5]: 4 + 3 = 7.
[^source]: I'm pretty sure William McKinley said something about using the gold standard on d6s specifically to appease the Great Normal Distribution of 1898.

## What do I do if a die is presented incorrectly?

I dunno, burn them at the stake or something. Along with all the dice that they've incorrectly manufactured. This isn't really divisive, I'm sure anyone can reasonably agree that this mistake is the second worst kind of dice-crime imaginable, right below cursed dice. Corporal punishment and executions are still very much a feature of dice-crime, and with a matter this serious, I'm sure you'll agree death by flames is the only suitable correction.

## Everyone screwed the pooch

And of course, there are many offenders within the fresh abundance of dice games. Let's take a look at, as of writing, the top 3 games in the [GMTK Game Jam 2022](https://itch.io/jam/gmtk-jam-2022) that model multiple d6 faces in three dimensions[^2d].

[^2d]: There are actually quite a few games that don't bother to show die faces in multiple dimensions. They cheat the actual rolling by simply changing the top face and shrinking or expanding the die to imply a rolling motion. I have relatively no qualms with this. I would still prefer to see the die rolling in action rather than some cheap camera trick, but it's not the end of the world.

First up, [Stompey Dicey](https://badpiggy.itch.io/stompey-dicey). Let's just take a look at its die rolling in action:

![It Was Heresy](/assets/images/dice/HERETIC.PNG)

AND LO! THE MAIN OFFENDER! A 6 face and a 1 face next to each other. This is beyond unforgivable. Next game.

[High Roller](https://blurofficial.itch.io/high-roller-gmtk-2022) actually gets it right, so no issues here. Kudos.

![High Roller Screenshot](/assets/images/dice/highroller.PNG)

[Dice Souls](https://featurekreep.itch.io/dice-souls)... also gets it right.

![Dice Souls](/assets/images/dice/dicesouls.PNG)

I wish I could sample every game, but you can see for yourself that at least one game out of all games submitted to the jam gets it wrong. And by some law of statistics, that means nearly 90% of the games I haven't shown are in ***violation of dice-law***. Don't just take my word for it. Just after Dice Souls is [Roll a 7](https://fm233.itch.io/roll-a-7), which not only uses a 6 sided die to represents what should be a 7 sided die, the 2 pips on the die **aren't even slanted**!

![Roll a 7](/assets/images/dice/Rolla7.PNG)

[Shutter Labs](https://tarodev.itch.io/shutter-labs) doesn't even have faces on a die! Just icons. Even worse, it only has a maximum of 5 faces on a **six-sided die**. One side is left blank forever.

![Shutter Labs Screenshot](/assets/images/dice/shutterlabsscreenshot.png)

I can see it. Staring at me. Taunting me. It is the ultimate monument to dice-crime. Anywhere you look within the jam, in real life, you can find examples of this flagrant disrespect to the principles of die faces that we have all worked so hard to uphold and protect.

I ask you now, what will we do? When generations, years from now look back on our works and learn the wrong lessons. They will see our inaccurate dice, and they will take the wrong lessons from them. If we do nothing to correct this blatant abuse of the sacred dice-principles that we all must adhere to, I see nothing but dice-chaos. A dark future where a die's faces mean **nothing** to anyone. And it scares me.

I can only hope that this post survives to correct these inadequacies. I hope you're all very pleased with yourselves, you treasonous dice-bastards.

Sidenote: Congrats to everyone who finished the jam, you should be proud! I *mostly* don't hate you for modelling dice wrong. Mostly.

## Extras: Controversial Dice Issues

There is no consistent standard from dice manufacturers about the orientation of the dice. Observe the same die as before:

<model-viewer alt="Six Sided Die Option 1" src="/assets/models/d6.glb" camera-controls disable-zoom style="width: 400px; height: 400px; margin-left: auto; margin-right: auto;"></model-viewer>

Try orienting the above model so that the 6 pips are facing upwards, and so the 5 pips face you[^6]. Where are the 3 pips located relative to the 4 pips?

[^6]: I call this the 6-5 orientation model, because I am an unrivalled dice-genius.

<model-viewer alt="Six Sided Die Option 2" src="/assets/models/alterd6.glb" camera-controls disable-zoom style="width: 400px; height: 400px; margin-left: auto; margin-right: auto;"></model-viewer>

What about for the die above?

I have seen both arguments for the two kinds of orientation in the wild, and there is no consistent standard. I am not unreasonable, and I understand how such inaccuracies could form. But we need to decide on a model for dice orientation, and *soon*. Personally, I'm an advocate of placing the 3 pips to the left-hand side of the 6-5 orientation model, because this consistently puts the 1, 2, and 3 pips on the "left" of the 4, 5, and 6 pips when using the 6-5 orientation model, akin to how a number line operates[^7].

[^7]: Lesser numbers are on the left, greater numbers are on the right.

There's also the question of which way to rotate the 2 and 3 pips, but there's no time to get into such a detailed and thorough argument in this short extras section. I don't want to waste anyone's time with such a long and relatively pointless argument (relative to the bigger issues at hand).

Don't even get me started on dice with other numbers of sides, and the whole "die vs. dice" pronunciation debacle.

## Footnotes