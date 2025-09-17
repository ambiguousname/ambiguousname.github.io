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

If you're new to formatted printing in FORTRAN, you're probably familiar with the `PRINT*,` or `WRITE(*, *)` statements[^printing]:

<iframe src='https://ambiguous.name/fortran-format-web-demo/?type=List+Directed+Formatting&variables=s%3D"I+have+exactly"%3Bi%3D20%3Bs%3D"apples"#output-text' class="embed-iframe"></iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?type=List+Directed+Formatting&variables=s%3D"I+have+exactly"%3Bi%3D20%3Bs%3D"apples"#output-text>
</noscript>

[^printing]: `PRINT F,` and `WRITE(*, F)` are the same statement. For consistency, we'll be using `WRITE(*, F)` for the rest of this post.

This is what you might want to use for printing in most cases, since it formats most variables correctly. However, you'll notice in the above example that there's a space in front of `I`. In fact, by convention, [all of FORTRAN's list-directed output requires a "blank character" at the beginning of each new line](https://wg5-fortran.org/N001-N1100/N692.pdf#G15.74858). If you want greater control of whitespacing, you'll need to use a format specifier:

<iframe src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22I+have+exactly%22%2C+I2%2C+%22apples%22&type=Format+Specification&variables=i%3D20#output-text" class="embed-iframe">
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22I+have+exactly%22%2C+I2%2C+%22apples%22&type=Format+Specification&variables=i%3D20#output-text>
</noscript>

Like with [C's printf arguments](https://www.man7.org/linux/man-pages/man3/printf.3.html), in FORTRAN we have edit descriptors. In this case, `I2` represents an integer, where `2` is the number of "positions" that an integer takes up when printing. For instance, when we have two apples:

<iframe src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22I+have+exactly%22%2C+I2%2C+%22apples%22&type=Format+Specification&variables=i%3D2#output-text" class="embed-iframe">
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22I+have+exactly%22%2C+I2%2C+%22apples%22&type=Format+Specification&variables=i%3D2#output-text>
</noscript>

The more that you experiment with FORTRAN's print statements, the more you'll notice weird overlaps and strange, seemingly useless features. What's up with all these different ways to do printing?

## Background

FORTRAN (FORmula TRANslating system, as described in The FORTRAN programmer's reference manual[^manual]), was released by IBM in 1956. It's ancient by computer science standards[^ancient]. The fact that is still relevant nearly 70 years after its creation is a testament, at least in part, to FORTRAN's efficiency. Widespread adoption amongst computational mathematicians doesn't hurt either.

[^ancient]: My father worked with FORTRAN IV in college. My grandfather has floppy disks of code he commissioned for his ship salvage work in the 1960s. Apparently they would digitize punchcards onto magnetic tape to run on Boeing's timeshare. Those would be later digitized into the floppy disks we have now.

[^manual]: [The FORTRAN Automatic Coding System for the IBM 704 EDPM: Programmer's Reference Manual](https://archive.computerhistory.org/resources/text/Fortran/102649787.05.01.acc.pdf), October 15th, 1956.

I tell you all this to give you some dire context: FORTRAN has so many ways to format I/O, and is so unintuitive compared to other languages simply because it is so old. The `FORMAT` statement dates to the first iteration of the language[^manual]. The statement `FORMAT(I2 /(E12.4, F10.4))` must work on punch cards just as well as (if not better than) any modern compiler.

Which is why you'll run into 5 different ways to handle `PRINT`, or `WRITE`, or `FORMAT` statements online. Improvements are present in every iteration of the language, but a million pieces of computing history are wedged underneath. This makes compatibility easier, at the cost of being quite confusing for new learners.

My hope is that this post, and the associated web tool, will de-mystify part of your `FORMAT`ting options.

## The Web Tool

A huge amount of thanks goes to Dr. George W Stagg, [whose post on LLVM's Flang runtime library running in WebAssembly](https://gws.phd/posts/fortran_wasm/) was instrumental to getting the web tool to work. Flang-RT is really the only modern solution we have available for running Fortran components on the web.

You can [view the tool online](https://ambiguous.name/fortran-format-web-demo/). The [source code for this tool is available on GitHub](https://github.com/ambiguousname/fortran-format-web-demo).

With all that said, let's talk about the core of FORTRAN's formatted I/O.

## The Edit Descriptors
 
### Integers


### Real Numbers

### Characters

#### Hollerith Constants

Before the `A` format descriptor (introduced in FORTRAN 66), there were [Hollerith Constants](https://en.wikipedia.org/wiki/Hollerith_constant), which have existed since the first FORTRAN manual[^manual]:

<iframe src="
https://ambiguous.name/fortran-format-web-demo/?stmt=4HTest&type=Format+Specification&variables=#output-text" class="embed-iframe">
</iframe>
<noscript>
<
https://ambiguous.name/fortran-format-web-demo/?stmt=4HTest&type=Format+Specification&variables=#output-text>
</noscript>

### Logicals

<!-- 
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

<iframe src="https://ambiguous.name/fortran-format-web-demo/?stmt=I2%2C+I2&type=Format+Specification&variables=i%3D0%3Bi%3D10%3Bi%3D20%3Bi%3D30#output-text" height="300" class="embed-iframe">
<a href="https://ambiguous.name/fortran-format-web-demo/?stmt=I2%2C+I2&type=Format+Specification&variables=i%3D0%3Bi%3D10%3Bi%3D20%3Bi%3D30#output-text"></a>
</iframe> -->

## Sources
All of the following were utilized heavily when referencing the behavior of FORTRAN functions:
- [Intel's Fortran Documentation](https://www.intel.com/content/www/us/en/docs/fortran-compiler/developer-guide-reference/2023-0/write-statement.html)
- [GNU's Fortran Docs](https://gcc.gnu.org/onlinedocs/gfortran/index.html#SEC_Contents) 
- [Oracle's FORTRAN 77 Reference](https://docs.oracle.com/cd/E19957-01/805-4939/index.html)

For describing the intended behaviors of FORTRAN, both [Computerhistory.org's archive of the first FORTRAN manual](https://archive.computerhistory.org/resources/text/Fortran/102649787.05.01.acc.pdf) and [fortran90.org/wg5-fortran.org's archive of FORTRAN standards](https://www.fortran90.org/) were extremely useful.

Since it is also the basis of the web demo, I've used the [LLVM Fortran Runtime docs/source code extensively](https://github.com/llvm/llvm-project/tree/main/flang).