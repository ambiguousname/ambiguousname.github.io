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

FORTRAN is in a bit of a stranger spot though. For beginners, the most convenient way to print out variables is with list-directed formatting, or the `PRINT*,` and `WRITE(*, *)` statements[^printing]:

<iframe src='https://ambiguous.name/fortran-format-web-demo/?type=List+Directed+Formatting&variables=s%3D"I+have+exactly"%3Bi%3D20%3Bs%3D"apples"#output-text' class="embed-iframe" height="160"></iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?type=List+Directed+Formatting&variables=s%3D"I+have+exactly"%3Bi%3D20%3Bs%3D"apples"#output-text>
</noscript>

[^printing]: `PRINT F,` and `WRITE(*, F)` are the same statement. For consistency, we'll be using `WRITE(*, F)` for the rest of this post.

This can have undesirable behavior. Notice in the above example that there's a space in front of `I`. That tends to really bug me when it comes to printing out variables, personally. In fact, by convention, [all of FORTRAN's list-directed output requires a "blank character" at the beginning of each new line](https://wg5-fortran.org/N001-N1100/N692.pdf#G15.74858). If you want greater control of whitespacing, you'll need to use a format specifier:

<iframe src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22I+have+exactly%22%2C+I2%2C+%22apples%22&type=Format+Specification&variables=i%3D20#output-text" class="embed-iframe" height="180">
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22I+have+exactly%22%2C+I2%2C+%22apples%22&type=Format+Specification&variables=i%3D20#output-text>
</noscript>

Like with [C's printf arguments](https://www.man7.org/linux/man-pages/man3/printf.3.html), in FORTRAN we have edit descriptors. In this case, `I2` represents an integer, where `2` is the "width" or number of characters that an integer takes up when printing. For instance, when we have two apples, we now have a space in place of a digit:

<iframe src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22I+have+exactly%22%2C+I2%2C+%22apples%22&type=Format+Specification&variables=i%3D2#output-text" class="embed-iframe" height="180">
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22I+have+exactly%22%2C+I2%2C+%22apples%22&type=Format+Specification&variables=i%3D2#output-text>
</noscript>

FORTRAN has a lot of oddities and peculiarities when it comes to dealing with I/O; the more that you experiment, the more you'll notice weird overlaps and seemingly useless features. What's up with all these odd ways to handle printing?

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

### Disclaimer

This post will not attempt to distinguish between what is or isn't supported between different FORTRAN versions, since Fortran-RT doesn't make this distinction either. For instance, the following code will compile for most FORTRAN compilers (although most will throw a warning if you set the standard):

```fortran
Program Main
	WRITE(*, "(5HHello)")
End Program
```

This is despite the fact that [Hollerith Constants](#hollerith-constants) [have deprecated from the FORTRAN standard since FORTRAN 77 (pg. A-2)](https://wg5-fortran.org/ARCHIVE/Fortran77.html), and were removed in Fortran 95.

With all that said, let's talk about the core of FORTRAN's formatted I/O.

## Edit Descriptors

Recall `10 FORMAT("I have", I2, "apples")`. `I2` is an edit descriptor specifying an "Integer edit" of width 2: when we `READ(*, 10)`, expect an integer with at most two digits; when we `WRITE(*, 10)`, we print out an integer of at most two digits.

Simply, edit descriptors describe "edits" that modify how we will either read from or write to different files.  A good understanding of how `FORMAT` works involves understanding a good deal of what edit descriptors are available to us:

### Data Edit Descriptors

These are descriptors that describe how to read into or write from variables.

#### Integers

##### `Iw`

`w` represents the width of the integer in the resulting print:

<iframe src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+I3&type=Format+Specification&variables=i%3D10#output-text" class="embed-iframe" height="180">
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+I3&type=Format+Specification&variables=i%3D10#output-text>
</noscript>

If the integer exceeds the width, the text will be replaced with `*`:

<iframe src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+I3&type=Format+Specification&variables=i%3D1000#output-text" class="embed-iframe" height="180">
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+I3&type=Format+Specification&variables=i%3D1000#output-text>
</noscript>

##### `Iw.m`

`m` represents the minimum number of characters to be displayed.

<iframe src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+I3.3&type=Format+Specification&variables=i%3D10#output-text" class="embed-iframe" height="180">
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+I3.3&type=Format+Specification&variables=i%3D10#output-text>
</noscript>

### Real Numbers

### Characters

#### Hollerith Constants

Before the `A` format descriptor (introduced in FORTRAN 66), there were [Hollerith Constants](https://en.wikipedia.org/wiki/Hollerith_constant), which have existed since the first FORTRAN manual[^manual]:

<iframe src="
https://ambiguous.name/fortran-format-web-demo/?stmt=4HTest&type=Format+Specification&variables=#output-text" class="embed-iframe" height="180">
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=4HTest&type=Format+Specification&variables=#output-text>
</noscript>

### Logicals

### Blank Control

### Carriage Control

#### `/`

### Representations

#### Binary `Bw[.m]`

#### Octal `Ow[.m]`

### Control Edit Descriptors


### Character String Edit Descriptors



### Repeatability

Some edit descriptors can have an integer in front to describe how many times you wish to repeat the edit descriptor. All data edit descriptors are repeatable:

TODO:

You can also use `()` to create a group for repeatability:

TODO:

#### Unlimited Format Item

You can also place `*` in front of a group to show that it repeats infinitely:

TODO: 

You cannot place further format items after an unlimited format item:

TODO: https://ambiguous.name/fortran-format-web-demo/?stmt=*%28I3%2C+X%29+I2&type=Format+Specification&variables=i%3D0%3Bi%3D0%3Bi%3D0#output-text


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

## Printing Multiple Variables

<iframe src="https://ambiguous.name/fortran-format-web-demo/?stmt=I2%2C+I2&type=Format+Specification&variables=i%3D0%3Bi%3D10%3Bi%3D20%3Bi%3D30#output-text" height="300" class="embed-iframe">
<a href="https://ambiguous.name/fortran-format-web-demo/?stmt=I2%2C+I2&type=Format+Specification&variables=i%3D0%3Bi%3D10%3Bi%3D20%3Bi%3D30#output-text"></a>
</iframe> -->

## Sources
All of the following were utilized heavily when referencing the behavior of FORTRAN functions:
- [Intel's Fortran Documentation](https://www.intel.com/content/www/us/en/docs/fortran-compiler/developer-guide-reference/2023-0/overview.html)
- [GNU's Fortran Docs](https://gcc.gnu.org/onlinedocs/gfortran/index.html#SEC_Contents) 
- [Oracle's FORTRAN 77 Reference](https://docs.oracle.com/cd/E19957-01/805-4939/index.html)

For describing the intended behaviors of FORTRAN, both [The Computer History museum's archive of the first FORTRAN manual](https://archive.computerhistory.org/resources/text/Fortran/102649787.05.01.acc.pdf) and [fortran90.org/wg5-fortran.org's archive of FORTRAN standards](https://www.fortran90.org/) were extremely useful.

Since it is also the basis of the web demo, I've used the [LLVM Fortran Runtime docs/source code extensively](https://github.com/llvm/llvm-project/tree/main/flang).

## Conclusion

Thank you for reading!

TODO: