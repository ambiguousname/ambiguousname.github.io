---
layout: post
title: Explaining FORTRAN's FORMAT statement
---

If you've ever done any amount of programming, you may be familiar with formatted printing<!--more-->. It's used in almost every modern language I can think of, from Python to Lisp.

Here's an example of a formatted print in C:

```c
printf("I have exactly %i %s", 20, "apples");
```
Which outputs `I have exactly 20 apples`.

If you're new to formatted printing in FORTRAN, you're probably familiar with the `PRINT*,` statement:

TODO: List-directed formatting in the web tool.
```fortran
PRINT*, "I have exactly ", 20, " apples"
```

This is a simple, hassle-free way to output whatever variables you'd like.

But you'll notice this outputs:
```
 I have exactly  20  apples
```

Why is there a space in front of the line? Why are there multiple spaces in between the number `20`? So you go back to some new tutorials, and you find you can define custom formatting statements with `PRINT "()",` or `WRITE(*, "()")`[^printing]:

[^printing]: `PRINT U,` and `WRITE(*, U)` are the same statement. For consistency, we'll be using `WRITE(*, U)` for the rest of this post.

<iframe src="https://ambiguous.name/fortran-format-web-demo/?stmt=A14,%20I2,%20A6&variables=i:20,s:'I%20have%20exactly%20',s:'%20apples'#output-text" height="300" class="embed-iframe">
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt='I%20have%20exactly',%20I2,%20'apples'&variables=i:20#output-text>
</noscript>

Someone online tells you `I2` is an edit descriptor for integers, and `A` represents strings. You also read somewhere that you need to put the length of the string after `A`. This is only true for [FORTRAN 66](https://wg5-fortran.org/ARCHIVE/Fortran66.pdf) and below[^hollerith], you don't need to include string lengths:

[^hollerith]: Before the `A` format descriptor (introduced in FORTRAN 66), there were [Hollerith Constants](https://en.wikipedia.org/wiki/Hollerith_constant), which have existed since the first FORTRAN manual[^manual].

<iframe src="https://ambiguous.name/fortran-format-web-demo/?stmt=A,%20I2,%20A&variables=i:20,s:'I%20have%20exactly%20',s:'%20apples'#output-text" height="300" class="embed-iframe">
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=A,%20I2,%20A&variables=i:20,s:'I%20have%20exactly%20',s:'%20apples'#output-text>
</noscript>

You don't even need to use `A` for constant strings:

<iframe src="https://ambiguous.name/fortran-format-web-demo/?stmt='I%20have%20exactly%20',%20I2,%20'%20apples'&variables=i:20#output-text" height="300" class="embed-iframe">
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt='I%20have%20exactly%20',%20I2,%20'%20apples'&variables=i:20#output-text>
</noscript>

The more you experiment with FORTRAN's print statements, the more you'll notice weird overlaps and strange, seemingly useless features. What's up with all these different ways to do printing? Who invented this language, anyways?

## Background

FORTRAN (FORmula TRANslating system, as described in The FORTRAN programmer's reference manual[^manual]), was released by IBM in 1956. It's ancient by computer science standards. This language is so old, my grandfather has floppy disks of FORTRAN IV code he commissioned for his ship salvage work in the 1960s[^floppy]. My father programmed in FORTRAN 77 in college. I'm programming in FORTRAN 90 as a graduate student. It is a generational beast[^thoughts].

[^floppy]: Apparently they would digitize punchcards onto magnetic tape to run on Boeing's timeshare. Those would be later digitized into floppy disks, as well.

[^manual]: [The FORTRAN Automatic Coding System for the IBM 704 EDPM: Programmer's Reference Manual](https://archive.computerhistory.org/resources/text/Fortran/102649787.05.01.acc.pdf), October 15th, 1956.

[^thoughts]: The fact that is still relevant nearly 70 years after its creation is a testament, at least in part, to FORTRAN's efficiency. Widespread adoption amongst computational mathematicians doesn't hurt either.

I tell you all this to give you some dire context: FORTRAN has so many ways to format I/O, and is so unintuitive compared to other languages simply because it is so old. The `FORMAT` statement dates to the first iteration of the language[^manual]. The statement `FORMAT(I2 /(E12.4, F10.4))` must work on punch cards just as well as (if not better than) any modern compiler.

Which is why you'll run into 5 different ways to handle `PRINT`, or `WRITE`, or `FORMAT` statements online. Improvements are present in every iteration of the language, but a million pieces of computing history are wedged underneath.

So, if you're a modern FORTRAN programmer, what are the conventions that you should be using?

## The Web Tool

A huge amount of thanks goes to Dr. George W Stagg, [whose post on LLVM's Flang runtime library running in WebAssembly](https://gws.phd/posts/fortran_wasm/) was instrumental to getting the web tool to work. Flang-RT is really the only modern solution we have available for running Fortran components on the web.

You can [view the tool online](https://ambiguous.name/fortran-format-web-demo/). The [source code for this tool is available on GitHub](https://github.com/ambiguousname/fortran-format-web-demo).

TODO: Transition?

With all that said, how many ways are there to skin FORTRAN's `FORMAT` statements?

## Possible values of `FORMAT`

There are probably only three statements you'll ever want to use for I/O control:

- `PRINT F, ! I/O variable list` Prints the values of the I/O variable list according to `F`.
- `READ(U, F ...) ! I/O variable list` - Takes a file descriptor under `U` (use `*` for stdin), and will read from the file into the input variables according to `F`. 
- `WRITE(U, F ...) ! I/O variable list` - Takes a file descriptor under `U` (use `*` for stdout), and will write to the file from the output variables according to `F`.

For any place where `F` can be input, there are multiple ways to provide a formatted statement.

### `*` - List Directed Formatting

The most set-it and forget-it option you could ever possibly find.

### `(...)` - 

### `U FORMAT(...)`

## Conversion fields
These are also just called "fields" in some other articles online

## Whitespace Control

### `advance=no`

TODO:
## Printing Multiple Variables

<iframe src="https://ambiguous.name/fortran-format-web-demo/?stmt=I2,%20I2&variables=i:0,i:10,i:20,i:30#output-text" height="300" class="embed-iframe">
<a href="https://ambiguous.name/fortran-format-web-demo/?stmt=I2,%20I2&variables=i:0,i:10,i:20,i:30#output-text"></a>
</iframe>

## Sources
[GNU's Fortran Docs](https://gcc.gnu.org/onlinedocs/gfortran/index.html#SEC_Contents) and [Oracle's FORTRAN 77 Reference](https://docs.oracle.com/cd/E19957-01/805-4939/index.html) were both utilized for a lot of the terminology described here. The first [FORTRAN manual](https://archive.computerhistory.org/resources/text/Fortran/102649787.05.01.acc.pdf) was also a huge help, as well as [fortran90.org's list of old standards](https://www.fortran90.org/).

Since it is also the basis of the web demo, I've used the [LLVM Fortran Runtime docs/source extensively](https://github.com/llvm/llvm-project/tree/main/flang).