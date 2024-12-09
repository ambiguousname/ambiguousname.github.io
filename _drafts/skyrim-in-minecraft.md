---
layout: post
title: Skyrim in Minecraft
---

It's been ported to Xbox, Playstation, Nintendo Switch, Alexa, and even your smart fridge. Why not Minecraft?

> DISCLAIMER

> I am about to engage in a hypothetical thought experiment.

> There will unfortunately, be no playable version of what I am about to describe.

## Background

I got back into Skyrim recently[^back]. Over the course of the past few days, I've been very nostalgic thinking about my childhood and all the things I never actually managed to complete. One of those things was a functional CreationKit mod. I tried to read the tutorials, use the CreationKit tools, and eventually I just gave up. Modding was too hard as someone who barely knew how to interface with his own computer. But now? Now I'm a grown adult. I've paid lots of money to get a certificate proving that I know how computers work. And more importantly, how to make an ambitious project out of thin air.

[^back]: Which is especially weird because I abandoned my Baldur's Gate 3 playthrough in the middle to instead chop up some Dragur in Bleak Fall's Barrow. The heart wants what it wants, I guess.

The key realization is in Skyrim's (and Morrowind's, and Oblivion's) `.esm` files. These store a *huge* amount of information. NPCs, Quests, Lighting, Objects, Factions, the list goes on. The thing is, almost *all* of Skyrim is contained in these files[^all]. You don't even really need the Skyrim executable. As long as you have something that knows how to parse `Skyrim.esm`, you can run Skyrim anywhere.

[^all]: Skyrim also splits heavier data like Textures, Models, and Voice Files into .bsa files. These are super interesting to talk about in and of themselves, but are beyond the scope of this post.

Like maybe say... Minecraft?

## Skyrim in Minecraft

I'm going to tap the 

> DISCLAIMER

sign before we get started. Making Minecraft into a `.esm` reader is a daunting task. Even picking one facet of Skyrim to port over would take months to get running in Minecraft. But it's fun to imagine doing things, and so I'm going to pick a simple task for us to hypothetically tackle.

Say, taking Skyrim's landscape and converting it into a world map for Minecraft.

### Part One: Understanding .esm

If you have Skyrim and a hex editor, I recommend you join along! I'm using [HxD](https://mh-nexus.de/en/hxd/). You could (and probably should) use something more advanced. 
To provide one last note, I will be using Skyrim Special Edition's `Skyrim.esm` file, you may see some differences in the file based on your version of Skyrim.

Here's what we get when we look at `Data/Skyrim.esm`:

![Hex editor data](/assets/images/skyrim/esm_start.png)

The first four bytes are recognizable right away: `TES4` (0x54455334) refers to The Elder Scrolls IV: Oblivion. A lot of Skyrim's data is based directly on Oblivion, so we'll see some references to that while we go through these files. I'm not sure I understand the rest of these bytes.

This is where Skyrim's active modding community comes to save the day. After entering a few different search terms, I eventually find this page: [https://en.uesp.net/wiki/Skyrim_Mod:File_Formats](https://en.uesp.net/wiki/Skyrim_Mod:File_Formats).

Thank you, Unofficial Elder Scrolls Pages! The hard work of reverse engineering this file format has been done for us; we just need to make sure that *we* can understand how `.esm` works.

UESP tells us that all `.esm` files are made up of two things:

- The [TES4 record](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/TES4)

- Top [groups](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format#Groups). I imagine, for organization

That seems very straightforward. Let's read the TES4 record first to see what we can learn about how this file format works.

#### Parsing TES4

Here's the full record:

```
54 45 53 34 36 00 00 00 81 00 00 00 00 00 00 00
00 00 00 00 2C 00 00 00 48 45 44 52 0C 00 48 E1
DA 3F 75 0A 0E 00 93 0F 00 FF 43 4E 41 4D 0A 00
6D 63 61 72 6F 66 61 6E 6F 00 49 4E 54 56 04 00
C5 26 01 00 49 4E 43 43 04 00 4E 02 00 00
```

78 bytes in total.

But of course, the ASCII representation will also be very helpful to us. I'm going to replace every non-ASCII character with � for clarity:

```
TES46�����������
����,���HEDR��Há
Ú?u���“��ÿCNAM��
mcarofano�INTV��
Å&��INCC��N���
```

In the documentation, UESP tells us that the first field we should see after `TES4` is the `HEDR` structure. But you'll notice `HEDR` is about 20 bytes ahead of `TES4`. What's the big idea?

Reading back through UESP's documentation, we see that "TES4 record" is not just jargon. A record is a [specific type](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format#Records) that we have to parse before we can move on to the information it actually contains.

So, a Record is made up of:

- A type (uint8\[4\], 4 bytes). This is `TES4` (`0x54455334`), which we already know.
- The size of the data field (uint32, 4 bytes). `.esm` files are Little Endian, so the least significant byte is first. We read `0x36000000` as 54.
	- The whole record is 78 bytes, so we know that this doesn't include the information that all records must contain.
- The flag (uint32, 4 bytes). We read `0x81000000`. Because this is Little Endian, we read this as `0x00000080` | `0x00000001`, or:
	- `0x00000001` - TES4 Master (ESM) file
	- `0x00000080` - Localized, loads string files associated with this module.
- The record form identifier (uint32, 4 bytes). This is `0x00000000`, or 0. 
- The timestamp (uint16, 2 bytes). This is `0x0000`, or 0.
- Version control info (uint16, 2 bytes). This is also `0x0000`.
- Internal version info (uint16, 2 bytes). This is `0x2C00`, or 44.
- Some unknown value (uint16, 2 bytes). This is `0x0000`.

After parsing each of these, we've finally reached `HEDR`! We've just read 24 bytes, and we know the whole record is 78 bytes. Therefore, as the size told us, we have exactly 64 bytes left to read before we read the whole record. Great!

`HEDR` is a [field](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format#Field) is made up of 12 + 6 bytes:
- Field type (uint8\[4\], 4 bytes). This is `HEDR` (`0x48454452`).
- Size of the field (uint16, 2 bytes). As UESP tells us, this value is `0x0C00`, or 12 bytes.
- Version (float32, 4 bytes). This is `0x48E1DA3F`, or roughly 1.71.
- Number of records and groups (uint32, 4 bytes). We get `0x750A0E00`, or 920181. WOW! That's a lot of records and groups.
- Next available object ID (uint32, 4 bytes). This is `0x930F00FF`, or 4278194067.

The next few fields we also read fairly easily.

`CNAM` (the Author) has data of 10 bytes, and reads as `mcarofano` in ASCII. This is most likely [Matthew Carofano](https://en.uesp.net/wiki/General:Behind_the_Wall:_The_Making_of_Skyrim), the Lead Artist on Skyrim.

`INTV` has data of 4 bytes. We don't really care about this one.

`INCC` has data of 4 bytes. We also don't care about this one.

And just like that, we've reached the end of `TES4`!

Wow!

#### Parsing Everything Else

Now that we know how to read records and fields, everything else should be easy!

We have one more data structure to learn about though, and that's the [Group](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format#Groups), or `GRUP`.

Let's read the `GRUP` that's right after the `TES4` record:

```
47 52
55 50 5E 7A 01 00 47 4D 53 54 00 00 00 00 0C 4B
0A 00 00 00 00 00 47 4D 53 54 ...
```

The `...` symbolizes lots more bytes because, as we'll find out, there are lots more bytes than this!

Here's the ASCII representation:

```
GR
UP^z��GMST�����K
�����GMST
```

Now we settle back into the routine of reading bytes:

- Record type (char\[4\]). This is just `GRUP`.
- Size of the group including our group header (uint32). This is `0x5E7A0100`, or 96,862 bytes!
- Label (uint8\[4\]). How the label is formatted depends on our type, but this is clearly read as `GMST`, or "Game Settings".
- Group Type (int32). This is `0x00000000`, so `GMST` is a top group.
- Timestamp (uint16). There's some math[^math] to calculate the timestamp from our value of `0x0C4B`.
- Version Control (uint16). We can ignore this one, but its hex value is `0x0A00`.
- Some unknown value (uint32). We ignore this one, and its hex value is `0x00000000`.

Finally TODO:

[^math]: From UESP's documentation, I calculated Y = (74/12 + 3) % 10 = 9, M = (74 % 12) + 1 = 3, D = 12. So (assuming my math is right), this would be March 12th, 2009.