---
layout: post
title: Explaining Fortran's FORMAT statement
---

If you've ever done any amount of programming, you may be familiar with formatted printing<!--more-->. It's used in almost every modern language I can think of, from Python to Lisp.

Here's an example of a formatted print in C:

```c
printf("I have exactly %i %s", 20, "apples");
```
Which outputs `I have exactly 20 apples`.

Here's what that same print statement looks like in Fortran:


TODO: Replace with web tool.
```fortran
PRINT '("I have exactly" I2 "apples")', 20
```

Which outputs `I have exactly20apples`

But you can also write it:

```fortran
PRINT*, "I have exactly", 20, "apples"
```

Which outputs
```
 I have exactly 20 apples
```

You could even write it:

```fortran
PRINT 10, "I have exactly", 20, " apples"
10 	FORMAT(A14, I1, A7)
```

Which outputs `I have exactly* apples`

You may have noticed a few problems already:
- What's up with the whitespacing in general with some of these?
	- Why is a space in front of one, but not the other?
	- Why is the space of some smushed together?
- Why are there so many ways to express one `FORMAT` statement?

Let's get into it.

## Background

FORTRAN (FORmula TRANslating system, as described in The FORTRAN programmer's reference manual[^manual]), is old. At least, by computer science standards. This language is so old, my grandfather has floppy disks of FORTRAN IV code he commissioned for his ship salvage work in the 1960s. My father programmed in Fortran 77 in college. I'm programming in Fortran 90 as a graduate student. It is a generational beast[^thoughts].

[^manual]: [The FORTRAN Automatic Coding System for the IBM 704 EDPM: Programmer's Reference Manual](https://archive.computerhistory.org/resources/text/Fortran/102649787.05.01.acc.pdf), October 15th, 1956.

[^thoughts]: The fact that is still relevant nearly 70 years after its creation is a testament, at least in part, to FORTRAN's efficiency. Widespread adoption amongst computational mathematicians doesn't hurt either.

I tell you all this to give you some dire context: FORTRAN has so many ways to format I/O, and is so unintuitive compared to other languages simply because it is so old. The `FORMAT` statement dates to the first iteration of the language[^manual]. The statement `FORMAT(I2 /(E12.4, F10.4))` must work on punch cards just as well as (if not better than) any modern compiler.

With that said, how many ways are there to skin FORTRAN's `FORMAT` statements?

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


## Sources
[GNU's Fortran Docs](https://gcc.gnu.org/onlinedocs/gfortran/index.html#SEC_Contents) and [Oracle's FORTRAN 77 Reference](https://docs.oracle.com/cd/E19957-01/805-4939/index.html) were both utilized for a lot of the terminology described here. The first [FORTRAN manual](https://archive.computerhistory.org/resources/text/Fortran/102649787.05.01.acc.pdf) was also a huge help.