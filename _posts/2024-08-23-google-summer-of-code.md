---
layout: post
title: "GSoC 2024: A Near Post-Mortem"
image: /assets/images/diagram.jpg
scale: 150%
---

I'm used to calling most of these kinds of posts postmortems. As part of final submissions though, I need a final report *before* the project is done. So it's almost a post-mortem<!--more-->. The patient's not quite dead yet, but I'm sure we can get there by the end.

My contributions to this year's [Google Summer of Code](https://summerofcode.withgoogle.com) (GSoC) were mostly to [Diplomat](https://github.com/rust-diplomat/diplomat), which is something of a side project of Unicode's [ICU4X internationalization library](https://github.com/unicode-org/icu4x). So how'd that go?

SPOILERS: Pretty well! You can [check out the final thing](https://unicode-org.github.io/icu4x/wasm-demo/) for yourself.

!["FixedDecimalFormatter.format" in large text. Below are four inputs: one labelled "Name", one "GroupingStrategy", one "F", one "Magnitude". Below is a submit button. There is output below the button, with the label "Output". There is no output.](/assets/images/gsoc/formatter.png)

## The Application

March 9th. I found out that GSoC applications were opening through a [mastodon post](https://manitu.social/@scummvm/112070067215305638) by [ScummVM](https://www.scummvm.org/). Then I forgot about it for roughly 3 weeks.

It's March 31st, a Sunday. I'm having something of a lazy morning. Cereal for breakfast, scrolling through my feed, etc. As part of a desperate gamble to avoid some responsibility until September, I'm looking for summer internships. It's not going very well. I remember the mastodon post from a few weeks ago. So I take a look at the GSoC website, and I notice applications are due in two days. 

I start panicking and scrolling through the GSoC submission requirements. I start feeling slightly crushed under the weight of the number of organizations I *could* apply to. Then I notice the recommended (and sometimes mandatory) contributions to a potential org before applying. I certainly don't have time to get started on that. My partner encourages me to apply anyways, because they are very smart and correct. So, I (somewhat reluctantly) get started.

DISCLAIMER: Don't do this yourselves. You should be starting your application early, especially to connect with an organization's maintainers. They can make or break your application.

UNDISCLAIMER: If you suddenly find yourself in a tight deadline like my own, I see no reason to why you can't do what I did. I will however, **emphasize** that I do not recommend this course of action.

I start making a list of projects. Any organization that requires some time getting to know them before submitting is off the list[^elimination]; I don't have the time. I decide early on that I only have time for one application. It needs the most amount of my focus and care. For that reason, I try to find a project that I feel most confident in handling.

[^elimination]: I also tried to eliminate any organizations that looked like they got a lot of applicants. I don't think this was all that effective (as I later found out, Unicode still had a significant number of applicants). I'm pretty sure every organization is bombarded with applicants. I'm sure there are absolutely some that get more applicants than others, so it's just a question of guessing.

It takes about an hour to narrow through my choices, but I ultimately decide on a project proposal from the [Unicode Consortium Project Ideas page](https://docs.google.com/document/d/e/2PACX-1vSdJAq5vzu2JOiB_nmrLtOMItZ0LPa4botgyr7RPLziNJ888anpfV6no12Vw8QHSFxHp5nsIazbQF5N/pub). I know Unicode as an organization, I'd be excited to work under them, and most importantly: I feel confident in this project proposal. The majority of the work is in Rust, but the end goal is creating an HTML page (that uses WASM). I feel very confident, having just finished a [WASM text editor]({% post_url 2024-02-28-wasm %}) to investigate WASM's inner workings for my own understanding. I've also been working on a [Rust project](https://github.com/ambiguousname/jackbox-custom-content/tree/rust-refactor) for the past 2 years[^rust]. It's at an intersection of a lot of things that I love to do, and it just seems *fun*.

[^rust]: Still working on it. To everyone who's waiting for more Jackbox Party Pack 7 mod tools, I'm sorry. When I have more free time, I promise.

So, I sit down and I just start writing. I do my best to try and communicate my expertise and understanding of the task at hand. A lot of the time is spent researching the details of the project I'm given. How does ICU4X work? How about Diplomat? What exactly is being asked of me[^asked]? I start writing and drafting. I try my best to include details of how *I* think everything will work. And a sample of what[^sample] I feel works the best for the question being posed. 

[^asked]: My biggest mistake (which I learned during my interview) was whether I would be implementing a whole AST parser myself... or just. You know. Using Diplomat. Which does that for you. Just goes to show how important research is. Especially if you can do it more than two days before the project is due.

[^sample]: In hindsight, I should have asked someone with some technical expertise to review. I lucked out in that it was readable enough to accept.

So I write, and write, and write. Then, on March 31st, 8PM, I submit the final report. And cross my fingers.

May 1st, I get the email. And I am very, very lucky. Thank you to the folks at Unicode for accepting me (and my mentor [Shane](https://www.sffc.xyz/) specifically), I am very much honored. You can read the [final proposal](/assets/unicode-proposal.pdf) yourself, if you're curious about the end result of all this havoc.

## The Project

Let's talk about Diplomat. If you're writing a library in Rust, and you want to make that library accessible in another language like C++, you can use a crate like [`cxx`](https://cxx.rs/). It's great for taking Rust code and making it callable from C++, and vice-versa. What if I want to make my Rust code callable from Javascript, however? Then you probably want [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen), which is for that exact sort of interface.

Okay, but now you also want Kotlin. And C. And maybe .NET. And so on. What you've stumbled onto is a dependency nightmare. You need to keep track of 6 different packages all from different sources. You have to manage your interoperability with all 6 sources, and one change could break any of the others.

Diplomat is an all-in-one solution to take your Rust library into as many languages as you could think of. Just so long as it has a backend written to support that language.

The backend I was pitching (at the suggestion of the project's maintainers) is called demo_gen.

### Problem Statement

For any of its backends, Diplomat requires you to create a Foreign Function Interface (FFI) to define how to interface with your rust code. This looks something like:

```rs
#[diplomat::bridge]
mod ffi {
	
	#[diplomat::rust_link(printer, Mod)]
	#[diplomat::opaque]
	struct SomeType;

	impl SomeType {
		pub fn println(&self, message : DiplomatStrSlice) {
			printer::println(message);
		}
	}
}
```

This is the starting point where we will generate equivalents for these bindings in Javascript, C, C++, etc. Everything is generated from diplomat's FFI definitions.

From this, we have a curious solution to a long-standing problem: documentation. Writing examples, guided tutorials, interactive terminals, they're all things that take time. But Diplomat has these `#[diplomat::bridge]`s, and these give us almost everything we need to make these examples ourselves.

So, my overarching purpose was to get Diplomat to create a webpage that could produce these examples automatically.

## The Goals

As of accepting the project, I came up with this rough list of goals:

1. Documentation of how automatic web demo generation should work.
2. A backend (that would later be called demo_gen) to take Rust functions and turn them into demo webpages.
3. An ICU4X webpage that uses this new backend to show demos.

But things are never that simple. When I started onboarding with Shane, I realized that project work would start while I was still in school. I didn't want to promise too much while I was dealing with so many final projects, so he suggested I do some work on revising Diplomat's Javascript backend.

The scope of the re-write is somewhat beyond the scope of this post, but suffice it to say: the old JS backend was holding back many parts of Diplomat that were very eager to move forward. demo_gen wouldn't even be possible without a re-write, as the old JS backend was reliant on a representation of code that was far too narrow for our purposes. So to make the message clear: listen to your mentor, they know the state of the project really well.

So the final deliverable became:

4. A re-written Javascript backend.

## The Work

Working in Diplomat was nothing too difficult. I'm glad I had a lot of initial time to re-write the JS backend, as it just took a lot of learning how Diplomat HIR backends were meant to work.

Beyond that though, I don't think I did anything too groundbreaking. Diplomat's hardest challenges had already been solved, and I was just writing code to fit within the design for both Javascript and demo_gen.

Shane and I were meeting roughly once a week to agree on upcoming deadlines and larger milestones for the project. I was also attending weekly meetings with the ICU4X working group. Mostly I was just there to learn about how Unicode works on the inside, and occasionally show progress on my project. The real meat of the work was in the day to day. Keeping track of the deadlines I set with Shane, and just hunkering down to make progress. The only times I'd raise my head up from my work would be to ask clarifying questions to Diplomat's maintainers[^maintainers].

[^maintainers]: I get nervous asking people for help just like anyone else, and a lot of the time I try to spend a few hours finding the solution myself. I love digging through the code of large projects to figure out what's wrong, but sometimes the problem just seemed to obtuse to get a straight answer from the code itself. That's when I asked for help.

Finishing the JS backend was really good news for the project. It cleared so much technical debt, and allowed many projects beyond mine to move forward. The old JS backend was really holding us back. 

I started moving towards the less well-defined demo_gen backend, and that's where the biggest challenge was. Once we had an end goal, we were trying to figure out the plan to get there. In fact, I wasn't even 100% sure what *I* knew the end goal was. For that reason, Shane and I made sure to have a live Google Doc for documentation to keep track of points for discussion, and parts of the design that were solidified. Eventually, everything that we wanted to solidify was placed in the [final documentation](https://github.com/rust-diplomat/diplomat/blob/main/docs/demo_gen.md). It was very stressful to figure out everything at the time though, and I'm very grateful I got to work with the Diplomat maintainers to outline the important details that I was getting stuck on.

![Whiteboard diagram outlining a rough file structure for demo_gen](/assets/images/diagram.jpg)

Beyond this, there's actually too much to say about the demo_gen backend here. I'm currently collaborating with the Diplomat maintainers on more of a public relations push that will have to happen later. More on that at the conclusion.

## The Deliverables

### The Resolved

Let's tackle our goals in order:

1. Documentation: I've been spending so much time writing documentation and presentations this week that my hands need a rest so I don't hurt them any more. Demo gen docs are [here](https://github.com/rust-diplomat/diplomat/blob/main/docs/demo_gen.md) and [here](https://rust-diplomat.github.io/book/demo_gen/intro.html)!
2. demo_gen: The demo_gen backend is in and working! It needs quite a few more customization options to feel more fully featured, but I am very proud of where it is right now.
3. ICU4X: The ICU4X demo is viewable [here](https://unicode-org.github.io/icu4x/wasm-demo/)!
4. Javascript: The mostly full Javascript backend is in! It's about as finished as the other Diplomat backends, so that's good enough for me. But everything I wanted to make sure was working in a revised Javascript backend is working, and it's even improved some over the original backend in quite a few ways.

!["Date.era" in large text. Below are four inputs: one labelled "Year", one "Month", one "Day", one "Name". Below is a submit button. There is output below the button, with the label "Output". There is no output.](/assets/images/gsoc/date.png)

### The Unresolved

All of the open [Demo Gen](https://github.com/rust-diplomat/diplomat/issues?q=is%3Aopen+is%3Aissue+label%3AB-demo_gen) and [JS](https://github.com/rust-diplomat/diplomat/issues?q=is%3Aopen+is%3Aissue+label%3AB-js-HIR) issues as of August 26th are unresolved.

Primarily, a lot of these issues are with customizability for demo_gen. I've been very much focused on the stability of the Javascript backend, which leaves demo_gen getting less attention.

This isn't great for demo_gen. One lesson I've learned quite a bit by now is every time you create a new and experimental framework and leave it in that experimental state, the more likely it is to be abandoned.

I hope other people would be excited to work on demo_gen, but I see something of an onus on me to help take care of this project, to try and get it into a really good place. I aim to hopefully work on closing those in my spare time, if I have some. But we'll see!

## What I Learned

I've absolutely learned a lot more about the inner workings of Rust; of the particulars of Diplomat's functionality; and so much more about how WASM, JS, and Rust all interact with each other. I'm very glad I just got to learn as part of my job, it's like the best thing ever.

When it comes to more reflection on production, that requires some more thought!

If I had psychically known ahead of time that I was planning on submitting to GSoC back in early march, I would have started the application process then. But I'm here now, and I don't really have any regrets. I just feel incredibly lucky to be here.

When it comes to actual takeaways, I feel as though I benefitted a lot from prior experiences. In working on large projects in College, in club leadership, in managing myself every day, the list goes on. The experience of GSoC just strengthened the takeaways of my prior experiences:

1. Set clear schedules for yourself. Do things early.
	- I couldn't keep a consistent 9-to-5, but I did mostly[^mostly] stick to the schedule of working on Mondays, Tuesdays, Thursdays, and Fridays.
2. Ask for help when you need it.
	- Especially if you're afraid that your co-workers know more than you. They might, but no one benefits if they can't help you[^help].
3. Take care of yourself, take breaks.

[^mostly]: I still definitely was not perfect. I worked some Wednesdays, some weekends when schedules were really stressful, but most of the time I managed to keep things under control.

All very simple stuff. I very much enjoyed getting to work on Diplomat this summer, and I very much enjoyed meeting everyone at the Unicode Consortium (and Google, by extension), and getting to be part of that world.

Thank you all for your hospitality, and I hope to stay in touch!

[^help]: Everyone I met at my internship was much smarter than me, and they were all very nice. I very much appreciate the help they gave, thank you all!

## Conclusion

Thank you for reading all the way until the end!

Diplomat is still an ongoing project, and I hope to continue contributing to it. I'm still contributing to the Diplomat team as we are making a huge push to get more eyes on the project. As part of that endeavour, I'm doing a few things:

- I am currently applying to speak at the Unicode Technology Workshop this year.
	- No promises that I'll be there, but it's looking likely!
- I am drafting ANOTHER blog post about the demo_gen backend. No idea when that will come out, but watch this space.
- I plan to continue work on the demo_gen backend, to further iterate on it.

### Plans Beyond GSoC

For everyone who's subscribed to my feed who also played [Spider-880]({% post_url 2024-08-02-indiepocalypse %}), thank you so much! I'm working on an update, expect something... probably in 3-4 months. I'm busy.

For anyone curious about that Jackbox modding tool, as the footnotes say, I'm working on it! I have absolutely no clue when it's coming out. The UI is almost all done, the main bit of work left to do is in saving and loading data to and from files. There'll be a beta release... at. some. point.

Other things coming down the pipe are more updates on [the game project I'm working on]({% post_url 2024-07-16-summer-work %}). I'll be posting about it when it's out, and that's probably the soonest bit of news you can expect to hear about.

### The End

Thanks again, everyone. If you can find a takeaway from any of this, it should be to [play Tactical Breach Wizards](https://store.steampowered.com/app/1043810/Tactical_Breach_Wizards/). That's what I'll be doing for the foreseeable future.

Kay, bye!