---
layout: post
title: Skyrim in Minecraft
---

It's been ported to Xbox, Playstation, Nintendo Switch, Alexa, and even your smart fridge. Why not Minecraft<!--more-->?

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

The first four bytes are recognizable right away: `TES4` (`0x54455334`) refers to The Elder Scrolls IV: Oblivion. A lot of Skyrim's data is based directly on Oblivion, so we'll see some references to that while we go through these files. I'm not sure I understand the rest of these bytes.

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

But of course, the UTF-8 representation will also be very helpful to us. I'm going to replace every human unreadable character with � for clarity:

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

Here's the UTF-8 representation:

```
GR
UP^z��GMST�����K
�����GMST ...
```

Now we settle back into the routine of reading bytes:

- Record type (char\[4\]). This is just `GRUP`.
- Size of the group including our group header (uint32). This is `0x00017A5E`, or 96,862 bytes!
- Label (uint8\[4\]). How the label is formatted depends on our type, but this is clearly read as `GMST`, or "Game Settings".
- Group Type (int32). This is `0x00000000`, so `GMST` is a top group.
- Timestamp (uint16). There's some math[^math] to calculate the timestamp from our value of `0x4B0C`.
- Version Control (uint16). We can ignore this one, but its hex value is `0x000A`.
- Some unknown value (uint32). We ignore this one, and its hex value is `0x00000000`.

Finally, we've hit the second `GMST`. This actually represents the `GMST` record that [UESP documents for us](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/GMST).

So we have some practice reading `.esm` files! Let's put it all together.

[^math]: From UESP's documentation, I calculated Y = (74/12 + 3) % 10 = 9, M = (74 % 12) + 1 = 3, D = 12. So (assuming my math and guesses as to the time format are right), this would be March 12th, 2009.

#### Putting it all together

Now that we've read UESP's documentation on `.esm`, I think we can extrapolate a fairly simple hierarchy:

- TES4 Record
	- Record Header (size, flags, ID, timestamp, etc.)
	- TES4 Record Data
- Groups
	- Group Header (size, label, type, timestamp, etc.)
	- Group Data
		- Records/Subgroups[^subgroup]
			- Record/Subgroup Header
			- Record Data

[^subgroup]: We treat the subgroup the same as a Group, just with a different type.

So this makes reasing `.esm` a cinch. We just need to find the right group associated with the data we want, and read from that. UESP lists all of the groups that Skyrim contains:

```
GMST, KYWD, LCRT, AACT, TXST, GLOB, CLAS, FACT, HDPT, HAIR, EYES, RACE, SOUN, ASPC,
MGEF, SCPT, LTEX, ENCH, SPEL, SCRL, ACTI, TACT, ARMO, BOOK, CONT, DOOR, INGR, LIGH,
MISC, APPA, STAT, SCOL, MSTT, PWAT, GRAS, TREE, CLDC, FLOR, FURN, WEAP, AMMO, NPC_,
LVLN, KEYM, ALCH, IDLM, COBJ, PROJ, HAZD, SLGM, LVLI, WTHR, CLMT, SPGD, RFCT, REGN,
NAVI, CELL, WRLD, DIAL, QUST, IDLE, PACK, CSTY, LSCR, LVSP, ANIO, WATR, EFSH, EXPL,
DEBR, IMGS, IMAD, FLST, PERK, BPTD, ADDN, AVIF, CAMS, CPTH, VTYP, MATT, IPCT, IPDS,
ARMA, ECZN, LCTN, MESG, RGDL, DOBJ, LGTM, MUSC, FSTP, FSTS, SMBN, SMQN, SMEN, DLBR,
MUST, DLVW, WOOP, SHOU, EQUP, RELA, SCEN, ASTP, OTFT, ARTO, MATO, MOVT, HAZD, SNDR,
DUAL, SNCT, SOPM, COLL, CLFM, REVB
```

In fact, you may recognize some of these names from somewhere...

![Creation Kit "Object Window" that shows a list of potential objects. Lots of objects are listed, including Actor, Music Track, Class, and Faction objects.](/assets/images/skyrim/ck_objects.png)

`NPC_` represents actors. `MUST`, music tracks. `CLAS`, classes. `FACT`, factions.

This is all the data you're directly editing when you work with Creation Kit. Except now we have the tools to read through all of these directly. CreationKit isn't even strictly necessarily. You could, if you were so inclined, write a Skyrim mod entirely in a hex editor (or notepad, if you're really twisted inside).

In fact, because there's so much information here, we'll be cross-referencing what we can read ourselves with what CreationKit can tell us[^ck].

[^ck]: If you're interested in following along, [please install CreationKit](https://ck.uesp.net/wiki/Category:Getting_Started)! Make sure CreationKit is installed on the same drive as Skyrim, as otherwise you'll encounter a `missing steamapi.dll` error like I did the first time I tried this.

Regardless, there's a lot of data here. For the purposes of this thought experiment, we don't need all of it. We're only interested in the `WRLD` group, which contains the information we need. That is, world data!

### Part Two: Reading WRLD
Let's just go to the start of the `WRLD` group and see what's there.

![Hex data from the WRLD group](/assets/images/skyrim/esm_wrld_group.png)

There's a lot here. Let's grab the first 80 bytes or so:

```
                                 47 52 55 50 99
7C 7D 0A 57 52 4C 44 00 00 00 00 03 3D 02 00 00
00 00 00 57 52 4C 44 75 11 16 00 00 00 00 00 3C
00 00 00 2F 30 1E 00 2C 00 0C 00 45 44 49 44 08
00 54 61 6D 72 69 65 6C 00 52 4E 41 4D 10 01 E4
FF 02 00 21 00 00 00 FC EB 10 00
```

In UTF-8, we get:

```
GRUP™
|}�WRLD�����=���
���WRLDu�������<
���/0��,���EDID�
�Tamriel�RNAM��ä
ÿ��!���üë��
```

We're just going to skip everything up until the second `WRLD`, since we've read all this group information before. That helpfully eliminates 24 bytes, bringing us to the `WRLD` Record.

I'll just print some information about this `WRLD` record before we dig into the real data:

- Size of 1,446,261 bytes (1.44 MB)
- No flags
- FormID of 60 (`0x0000003C`)
- Internal Version of 44

Skipping over the rest of the information, we can see this `WRLD` record has an `EDID` (Editor ID) of Tamriel.

Where have I seen that name before?

![Skyrim's Tamriel Object information in Creation Kit](/assets/images/skyrim/tamriel.png)

And there's our FormID! Note that it's flipped because CreationKit is trying to represent the least significant digit last (to make it human readable, whereas `.esm` actually represents things Little Endian).

Before we go any further, let's see what [UESP has to say about `WRLD`](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/WRLD).

Well already, most of this information doesn't look helpful. We're interested in raw vertex data. But we have at least confirmed that we are looking at the World data for Skyrim, which will hold the vertex data we want.

UESP mentions that each `WRLD` record is followed by group containing a `CELL` record and then multiple sub-`GRUP`s, each containing Exterior Cell Block information.

So let's skip ahead 1,446,261 bytes past `WRLD` to get our first sub-`GRUP` record:

```
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
47 52 55 50 CC 03 22 09 3C 00 00 00 01 00 00 00
02 48 0A 00 58 B8 17 03 43 45 4C 4C 8B 00 00 00
00 04 04 00 74 0D 00 00 0F 68 3E 00 28 00 04 00
```

In UTF-8:

```
����������������
GRUPÌ�"�<�������
�H��X¸��CELL‹���
����t�����h>�(���
```

You know the drill. We read the `GRUP` information, and then we skip ahead to `CELL`. Although, hold on one second.

`CELL`'s flags are `0x00040400`. These flags are:

`0x00040000` - Data is compressed with ZLIB.

`0x00000400` - Persistent[^temp] Cell.

While we might be interested in this `CELL` later on, [`CELL` does not contain any useful terrain data](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/CELL) that we're interested in. It's used for location, lighting, and placing objects. This will be useful for knowing *where* to place terrain data, but we're still not there just yet.

Theoretically you could keep reading through `GRUP`s and sub-`GRUP`s until you get to the right `GRUP` that has the information you need, but let's just skip there for convenience's sake. That is, we're interested in the `LAND` record:

```
                                 47 52 55 50 84
58 00 00 E3 90 00 00 09 00 00 00 02 48 0A 00 38
DF 12 00 4C 41 4E 44 CA 2B 00 00 00 00 04 00 E3
A0 00 00 0B 67 3A 00 25 00 0B 00 FE 44 00 00 78
```

```
GRUP„
X��ã��������H��8
ß��LANDÊ+������ã
����g:�%���þD��x
```

The group:

- Is 22,660 bytes long (including the 24 byte header).
- Is a child of an Exterior Cell Sub-Block
	- This group holds the children of a temporary[^temp] cell.
	- The temporary cell associated with this `GRUP` is a `CELL`, FormID `0x000090E3`.

[^temp]: A persistent cell is a cell that is designed to remember what stuff is in it when you leave. It's what allows bodies to persist in towns once you come back. A temporary cell is just the opposite: it will be unloaded when you leave and will reset when you come back.

Meanwhile, `LAND`:

- Is 11,210 bytes long.
- Is compressed.
- Has FormID `0x0000A0E3`.

Let's look for this FormID in the Creation Kit! We use Edit->Find Text.

![Search window with result text: LAND Form " (0000A0E3)](/assets/images/skyrim/esm_land.png)

Land ho! Let's load this sucker in.

![Shot of some dirt and tree leaves](/assets/images/skyrim/land_ho.png)

Looking around, we can actually see that we're very close to the city of Whiterun:

![Shot of a hilly landscape and the city of Whiterun in the background](/assets/images/skyrim/land_whiterun.png)

Exciting! Let's figure out how to actually read `LAND`, since it's compressed. [UESP tells us](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format#Records) that compressed records give the first 4 bytes as the decompressed size.

In this case, that's 

```
FE 44 00 00
```

Or 17,662 bytes.

We can't just decompress a little bit of `LAND` to read it, we have to decompress the whole thing.

So we decompress with Zlib's DEFLATE[^decompress]:

```
44 41 54 41 04 00 1F 00 00 00 56 4E 4D 4C
```

```
DATA������VNML
```

`VNML` is just vertex normals, so we jump to `VHGT`:

```
               56 48 47 54 48 04 00 80 39 C4 00 F9
F9 FA FA FA FA FB FB FB FC FC FE FF FF FD FD FE FD
```

```
VHGTH��€9Ä�ùù
úúúúûûûüüþÿÿýýþý
```

Now UESP tells us how we can exactly [read vertex heights](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/LAND).

- The first 4 bytes represent our offset height, and the height of the land at the southwest of our Cell.
	- This is `0xC4398000`, or -742. 
- Each subsequent byte represents some height value.
	- So the next byte `0x00` represents no change in height at Row 0, Column 1.
	- The next byte `0xF9` represents a change in height by -7 at Row 0, Column 2.
	- And so on.

Congrats, now we're reading height data!

We can verify this is the correct height data by opening the heightmap in Creation Kit. Looking at our Cell's reference, the Cell is at coordinates (7, 7). We look at the southwest corner of the cell:

![Cursor hovering over the southwest corner of Cell (7, 7). Z = -5936 at this position.](/assets/images/skyrim/cell_height.png)

Now we just have to take our height value (-742), and multiply it by 8 to get our in-game units height.

-742 * 8 = -5936. This is our Z-value exactly!

Alright. We know how to read `.esm`. We know how to interpret vertex data. Let's move into Minecraft.

### Part Three: Minecraft!