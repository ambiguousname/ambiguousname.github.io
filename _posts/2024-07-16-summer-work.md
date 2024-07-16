---
layout: post
tags: ["Google Summer of Code", "SFMOMA"]
image:
---

This is an update post to my [previous post]({% post_url 2024-06-21-summer-work %}) sent at the start of summer. 

## Update One
This one is smaller, but fairly significant! You'll see some of my work at SFMOMA's Artcade, opening sometime around mid-October. SFMOMA is calling it their "Artcade".

You can view the announcement [here](https://www.sfmoma.org/press-release/sfmoma-announces-major-exhibition-exploring-the-influence-of-sports-on-contemporary-culture/). We're all the way at the bottom in tiny text.

Our submission is

# SUPER ULTRA RACING XTREME

We're currently looking for playtesters. If that's something that interests you, come check out our [playtesting discord](https://discord.gg/TCYrvwqgbB).

## Update Two
I've been hard at work on various projects at Unicode, mostly involving their [diplomat](https://github.com/ambiguousname/diplomat) tool. We're trying to create a tool that can look at a foreign function interface definition and create an automatic web demo from any function that outputs a string.

The culmination of the past two months of work has been this [proof of concept](http://ambiguous.name/diplomat/).

For a halfway point, that's pretty good. There are a lot of elements that go into supporting even this thin slice. Part of my job requires so much communication and writing documentation, so I'm not really interested in talking about how it works here. You can check my github PRs for explanations and documentation if you're really that curious.

What I do want to talk about is some of what I've been feeling while working on this project. Not that I expect anyone reads these blog posts, but as a relatively new open source contributor, I want to be an inexperienced voice.

Mostly, I find myself coming back to the issue of

### Longevity
As a hobbyist developer (web developer especially), I see so much discourse around what the next big thing is. It's always easy to point and say "yeah, like *that* will pan out in the next 4 years". And if you like taking a cynical position, you're probably going to be right 90% of the time.

I am that cynical guy. I like working on safe, sensible projects. That's what makes working on things that have less of a foundation so interesting and scary at the same time. 

I'm technically working under Unicode's [ICU4X project](https://github.com/unicode-org/icu4x?tab=readme-ov-file). ICU4X is great. I wish I had more to say about it. If you're thinking about internationalization work (especially small and portable internationalization code), it's a fantastic option. I'm not contributing to ICU4X though.

ICU4X needs something to make it portable across languages, and that's [Diplomat](https://github.com/rust-diplomat). This is where I am contributing most of my work. The meaningful contributions I've made there are in rewriting Diplomat's Javascript conversion backend, as well as the meat and potatoes of creating web demos from Diplomat FFI definitions.

Progress behind the scenes has been fantastic. Everyone asks very thoughtful questions of how the project will unfold, and how we want to manage our progress to stay on track. I love the opportunity I have to really prod my peers and mentors to understand how they see software development. These are all people with years of experience in making software, and for Unicode especially that's all about software that's fundamental to how we use computers. Even with all that experience in the room, the drive to create something special, no one can say for sure what the future holds. We have a lot of hopes, but no one can say with absolute certainty what longevity exists.

### A Thousand Years
How long will it be until someone uses Diplomat for the last time? 10? 20?

Computers have barely been around for two thousand, and the architecture has changed drastically from decade to decade. I doubt you could get DOOM running on the Difference engine. 

But we at least remember Charles Babbage and Ada Lovelace. How long will Diplomat's code be remembered? 100? 1,000? I have a badge on my Github profile for contributing to the [Arctic Vault](https://archiveprogram.github.com/arctic-vault/), which is meant to last around 1,000 years[^birthday]. I guess that's the best I could personally hope for.

[^birthday]: My old and embarrassing website was preserved, as well as me wishing a happy birthday to one of the HackClub founders.

There's so much that matters to me that I wish was preserved. My favorite songs, books, games, jokes from a dream that I wrote down in my phone. Why can't it all be remembered? I think [Jacob Geller](https://www.youtube.com/watch?v=ukJ_UA-JS5o) has a fantastic video on this: we remember so much, and it does nothing but offer the promise of a slightly longer memory. I want to live through history, but the fundamental law of entropy makes it a near-certainty that so much will be forgotten. I keep thinking bigger and bigger until I can concieve of nothing but an empty Universe with nothing of us left in it.

Why does this all matter so much?

To me at least, the reason I code is for other people. I can't *just* enjoy something that I made. I want to know that someone, anyone else is getting some value out of it. And it's really hard to reconcile that with the fact that it will some day be forgotten. Not just on the scale of billions, millions, thousands of years. Things can be forgotten in years, months, even days. If it's forgotten, does it have value?

### Let's Scope Back Down
I find solace in the fact that the future is unknowable, even in the face of certainty. I wish I knew how long the work I'm doing for Diplomat will be used for.

But does it matter? Diplomat is licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)[^domain]. You can go in and adapt our work right now, if you'd like. Not just code, but ideas, design patterns, naming conventions, whatever you can take from it. I don't know how my work will eventually be used, and that makes me happy.

[^domain]: I'm also really excited for the time when copyrighted software starts to enter the public domain. I will probably be dead when this happens, but I hope people end up making cool things with it.

I hope that the volume of work that has gone into Diplomat can help even just one developer with their own projects. Be that inspiration, re-usable code, or just documenting that we were here. I have no idea what anyone might get out of it, and I can only hope. Hope that a developer learns, that a developer builds, that something of me comes through. But I hope beyond all hopes, someone has fun.

Here's to the end of the universe.

## Conclusion
Thanks for reading! I want to re-state how glad I am for the opportunity I have to work with Unicode. They are all wildly talented people, and I am honored to just hang out around them.

I'm looking forward to wrapping up this project around September or so, and I'll probably send out a finale or postmortem post around early October.

I think it's only fair to name my own influences when making this post.

First, my mentor at Unicode, [Shane Carr](https://www.sffc.xyz/) has been invaluable throughout my internship. I'm super appreciative of everything Shane has done to help me throughout my journey at Unicode. Thank you!

Second, I really love the work of [MattKC](https://mattkc.com/). Their huge contributions to a large number of open source efforts has inspired me to do so much. If only every Youtuber were as dedicated.

Finally, I learned of GSoC from a post by [ScummVM](https://www.scummvm.org/) on Mastodon. This led me to put together a proposal in 6 hours or so of a single day (after I realized the deadline was 2 days away). I feel incredibly luckily, and I want to thank whoever runs ScummVM's Mastodon account for kickstarting what seems to be a snowball of great opportunities.

Speaking of opportunities, I have some additional exciting news that I will be announcing in early August! See you in a month!