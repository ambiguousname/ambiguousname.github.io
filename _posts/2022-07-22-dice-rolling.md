---
layout: post
title: Everyone's Modelling Dice Wrong
img: /assets/images/dicebanner.png
---
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
I didn't think I'd ever make this post, but here we are.

Sure, it's been kicking around in the back of my head for a while, but now that the [GMTK Game Jam 2022](https://itch.io/jam/gmtk-jam-2022) is over, and its theme specifically deals with dice...

It's time we had a chat about representing dice accurately. Now that there are an abundance of dice rolling games, it's time you know that there are *conventions* when
it comes to making accurate dice for... pretty much any number of sides you could possibly imagine. Are there actual, real, physical standards that every die ever manufactured
has to conform to?

Well... no... but there *should* be. Let's start with the basic d6[^1]. Here's a model of what your typical d6 **should** look like, based on the many d6s I just so happen to carry around with me at all times[^2]:

[^1]: For you non-dice nerds, first of all: HOW DARE YOU. Secondly, xdy means x number of y sided dice.
[^2]: I carry roughly 100 six sided dice with me in a bag at all times, plus about 6 giant foam six sided dice, just in case. LOOK, DON'T JUDGE ME, OKAY? I NEED THEM TO PROVE A POINT. I BOUGHT THEM FOR REASONS UNRELATED TO THIS POST, BECAUSE I'M COOL, UNLIKE YOU.

<model-viewer alt="A REAL Six Sided Die" src="/assets/models/d6.glb" camera-controls disable-zoom style="width: 400px; height: 400px; margin-left: auto; margin-right: auto;"></model-viewer>

At any point, feel free to drag around this 100% accurate model of the average the d6 to PROVE the correctness of my argument. In fact, why don't you get your own dice to confirm? A variety of d6s from different manufacturers should help to sell you on the sense of what is or isn't proper in terms of the rough standard for d6s.

Speaking as a dice expert[^accredit], let's start with the most important aspect. Face placement. This is something that should apply to *all* dice not just d6s, so...

: For any die, two opposing faces on that die should sum to one more than the number of faces on the die.

[^accredit]: I'm not accredited or anything, I just... look at a lot of dice. HEY! That *nearly* accounts for accreditation. Not that any school I've furiously emailed has ever bothered to respond about adding a degree in dice studies. 

You'll notice on any *good* d6, 6 and 1 are opposite each other[^3], same with opposing faces 5 and 2[^4], and 4 and 3[^5]. This is the <u>golden standard</u> for any die[^source] that has opposing faces.

[^3]: 6 + 1 = 7.
[^4]: 5 + 2 = 7.
[^5]: 4 + 3 = 7.
[^source]: I'm pretty sure William McKinley said something about using the gold standard on d6s specifically to appease the great normal distribution of America.

## Everyone screwed the pooch

Now that we've gotten basic dice theory out of the way, it's time to discuss how *deeply* ashamed I am of all of you, and I wish you would all throw your dice into a molten volcano. Let the ozone layer build up, I don't want to breathe the same air you are if it means living with inaccurate dice.

Let's take a look at, as of writing, the top 3 games in the [GMTK Game Jam 2022](https://itch.io/jam/gmtk-jam-2022) that model multiple die faces in three dimensions.

First up, [Stompey Dicey](https://badpiggy.itch.io/stompey-dicey). There are actually quite a few games that use two dimensional dice rolling (without 3D faces), and I have *relatively* no qualms with that. Would I prefer 3D representations of dice? Absolutely. It's no question that 3D dice are generally superior to 2D dice in every way. But what I do have a problem with is the *monumental* avalanche of lies that Stompey Dicey propagates through its innacurate 3D dice rolling:

![It Was Heresy](/assets/images/dice/HERETIC.PNG)

AND LO! THE MAIN OFFENDER! A 6 face and a 1 face next to each other! I am beyond ***incensed*** at this deliberate mockery of what dice represent. Next game!

[High Roller](https://blurofficial.itch.io/high-roller-gmtk-2022) actually gets it right, so no issues here. Kudos to you for getting it right.

![High Roller Screenshot](/assets/images/dice/highroller.PNG)

[Dice Souls](https://featurekreep.itch.io/dice-souls)... also gets it right.

![Dice Souls](/assets/images/dice/dicesouls.PNG)

Whatever. But guess what? Just after Dice Souls is [Roll a 7](https://fm233.itch.io/roll-a-7), which not only uses a 6 sided die to represents what should be a 7 sided die, the 2 pips on the die **aren't even slanted**!

![Roll a 7](/assets/images/dice/Rolla7.PNG)

[Shutter Labs](https://tarodev.itch.io/shutter-labs) doesn't even have faces on a die! Just icons! It doesn't even go up to 6! It leaves one side blank!

![Shutter Labs Screenshot](/assets/images/dice/shutterlabsscreenshot.png)

And you can find examples everywhere you look! On top of the thousands of ~somewhat~ inaccurate submissions, some die manufacturers don't even get die faces right! I've had to forcefully eject many a d6 from my house because the manufacturers couldn't even bother to get the faces right. They are ALL GUILTY!

Do you see what you've done? You've upset Timmy. I asked him why he was crying, and he said to me:

`They just don't get it my good fellow. I, a young nine year old, am so upset at the inaccuracies that game developers maliciously insert into their entertainment products to hurt me. You see, I am too stupid to discern reality from fantasy, and this whole "inaccurate faces" issue only serves to confuse my tiny little brain even moreso than inhaling all of that lead and coal dust. And on top of everything, my pet canary died in the mines! So I hope they are right and proper pleased with themselves.`

And then he went and flung himself down the bottom of a well! It's gonna take me days to dig him out!

I hope you're very pleased with yourselves, and I hope you can understand that this is not just an issue of realism. Think of the children, you heartless monsters. Think of them whenever you decide to model a 3D die, and you decide not to take into account the multitude of factors that go into such a monumental effort. Because then, you might be redeemed in the eyes of dice purists everywhere.

Sidenote: Congrats to everyone who finished the jam, you should be proud! I *mostly* don't hate you for modelling dice wrong. Mostly.

## Extras: Controversial Dice Issues

There is no consistent standard from dice manufacturers about the orientation of the dice. Observe the same die as before:

<model-viewer alt="Six Sided Die Option 1" src="/assets/models/d6.glb" camera-controls disable-zoom style="width: 400px; height: 400px; margin-left: auto; margin-right: auto;"></model-viewer>

Try orienting the above model so that the 6 pips are facing upwards, and so the 5 pips face you[^6]. Where are the 3 pips located relative to the 4 pips?

[^6]: Experts (me) call this the 6-5 orientation model, because I am an unrivalled dice genius.

<model-viewer alt="Six Sided Die Option 2" src="/assets/models/alterd6.glb" camera-controls disable-zoom style="width: 400px; height: 400px; margin-left: auto; margin-right: auto;"></model-viewer>

What about for the die above?

I have seen both arguments for the two kinds of orientation in the wild, and there is no consistent standard. I am not unreasonable, and I understand how such inaccuracies could form. But we need to decide on a model for dice orientation, and *soon*, lest we face devolving into completely irrational chaos. Personally, I'm an advocate of placing the 3 pips to the left-hand side of the 6-5 orientation model, because this consistently puts the 1, 2, and 3 pips on the "left" of the 4, 5, and 6 pips when using the 6-5 orientation model, akin to how a number line operates[^7].

[^7]: Lesser numbers are on the left, greater numbers are on the right.

There's also the question of which way to rotate the 2 and 3 pips, but I would argue that would be an even longer debate that we simply don't have time for in this small extras section. So, moving on!

## We won't speak of this

Don't even get me started on dice with other numbers of sides, and the whole "die vs. dice" pronunciation debacle.

## Footnotes