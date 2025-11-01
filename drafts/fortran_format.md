---
layout: post
title: Explaining FORTRAN's FORMAT statement
image: /assets/images/fortran_logo.svg
image-alt: The FORTRAN logo
---

If you've ever done any amount of programming, you may be familiar with formatted printing<!--more-->. It's used in almost every modern language I can think of, from Python to Lisp.

Here's an example of a formatted print in C:

```c
printf("I have exactly %i %s", 20, "apples");
```
Which outputs `I have exactly 20 apples`.

FORTRAN is in a bit of a stranger spot though. Generally, the most convenient way to print out variables is with list-directed formatting. We perform this with the `PRINT*,` and `WRITE(*, *)` statements[^printing]:

<iframe tabindex="-1" src='https://ambiguous.name/fortran-format-web-demo/?type=List+Directed+Formatting&variables=s%3D"I+have+exactly"%3Bi%3D20%3Bs%3D"apples"#output-text' class="embed-iframe" height="160" title='WRITE(*, *) "I have exactly", 20, "apples" ! OUTPUTS " I have exactly 20 apples"'></iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?type=List+Directed+Formatting&variables=s%3D"I+have+exactly"%3Bi%3D20%3Bs%3D"apples"#output-text>
</noscript>

[^printing]: `PRINT F,` and `WRITE(*, F)` are the same statement. For consistency, we'll be using `WRITE(*, F)` for the rest of this post.

This can have undesirable behavior. Notice in the above example that there's a space in front of `I`. That tends to really bug me when it comes to printing out variables, personally. In fact, by convention, [all of FORTRAN's list-directed output requires a "blank character" at the beginning of each new line](https://wg5-fortran.org/N001-N1100/N692.pdf#G15.74858). If you want greater control of whitespacing, you'll need to use a format specifier:

<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22I+have+exactly%22%2C+I2%2C+%22apples%22&type=Format+Specification&variables=i%3D20#output-text" class="embed-iframe" height="180" title='10 FORMAT("I have exactly", I2, "apples") WRITE(*, 10) 20 ! OUTPUTS "I have exactly20apples"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22I+have+exactly%22%2C+I2%2C+%22apples%22&type=Format+Specification&variables=i%3D20#output-text>
</noscript>

Like with [C's printf arguments](https://www.man7.org/linux/man-pages/man3/printf.3.html), in FORTRAN we have edit descriptors. In this case, `I2` represents an integer, where `2` is the "width" or number of characters that an integer takes up when printing. For instance, when we have two apples, we now have a space in place of a digit:

<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22I+have+exactly%22%2C+I2%2C+%22apples%22&type=Format+Specification&variables=i%3D2#output-text" class="embed-iframe" height="180" title='10 FORMAT("I have exactly", I2, "apples") WRITE(*, 10) 2 ! OUTPUTS "I have exactly 2apples"'>
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

Recall `10 FORMAT("I have", I2, "apples")`. `I2` is an edit descriptor specifying an *Integer Edit* of width 2: when we `READ(*, 10)`, we expect an integer represented by at most two characters; when we `WRITE(*, 10)`, we print out an integer of at most two characters.

Simply, edit descriptors describe "edits" that modify how we will either read from or write to different files.  A good understanding of how `FORMAT` works involves understanding a good deal of what edit descriptors are available to us:

### Data Edit Descriptors

These are descriptors that describe how to read into or write from variables.

#### Integers

##### `Iw`

`w` represents the width of the integer in the resulting print:

<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+I3&type=Format+Specification&variables=i%3D10#output-text" class="embed-iframe" height="180" title='10 FORMAT("Value:", I3) WRITE(*, 10) 10 ! OUTPUTS "Value: 10"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+I3&type=Format+Specification&variables=i%3D10#output-text>
</noscript>

If the integer exceeds the width, the text will be replaced with `*`:

<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+I3&type=Format+Specification&variables=i%3D1000#output-text" class="embed-iframe" height="180" title='10 FORMAT("Value:", I3) WRITE(*, 10) 1000 ! OUTPUTS "Value:***"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+I3&type=Format+Specification&variables=i%3D1000#output-text>
</noscript>

##### `Iw.m`

`m` represents the minimum number of characters to be displayed.

<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+I3.3&type=Format+Specification&variables=i%3D10#output-text" class="embed-iframe" height="180" title='10 FORMAT("Value:", I3.3) WRITE(*, 10) 10 ! OUTPUTS "Value:010"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+I3.3&type=Format+Specification&variables=i%3D10#output-text>
</noscript>

#### Real Numbers

##### Decimal - `Fw.d`

As with integers, `Fw.d` is an edit descriptor:

- `F` represents a floating point number
- `w` the width of the decimal in characters, including the decimal point
- `d` the number of digits expected after the decimal point

<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+F10.5&type=Format+Specification&variables=r%3D3.1415#output-text" class="embed-iframe" height="180" title='10 FORMAT("Value:", F10.5) WRITE(*, 10) 3.1415 ! OUTPUTS "Value:   3.14150"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+F10.5&type=Format+Specification&variables=r%3D3.1415#output-text>
</noscript>

##### Exponential Form - `Ew.d`

<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+E7.1&type=Format+Specification&variables=r%3D3.1415#output-text" class="embed-iframe" height="180" title='10 FORMAT("Value:", E7.1) WRITE(*, 10) 3.1415 ! OUTPUTS "Value:0.3E+01"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+E7.1&type=Format+Specification&variables=r%3D3.1415#output-text>
</noscript>

Note that `w` always represents a width in characters of the displayed output. So even though `0.3E+01` is comprised of only two digits, it makes up 7 characters in total. So if we were to shrink the number of characters:

<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+E5.1&type=Format+Specification&variables=r%3D3.1415#output-text" class="embed-iframe" height="180" title='10 FORMAT("Value:", E5.1) WRITE(*, 10) 3.1415 ! OUTPUTS "Value:*****"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+E5.1&type=Format+Specification&variables=r%3D3.1415#output-text>
</noscript>

##### Exponential Form - `Dw.d`

The `D` functions the same as the `E` edit descriptor, with one minor cosmetic change:
<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+D7.1&type=Format+Specification&variables=r%3D3.1415#output-text" class="embed-iframe" height="180" title='10 FORMAT("Value:", D7.1) WRITE(*, 10) 3.1415 ! OUTPUTS "Value:0.3D+01"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+D7.1&type=Format+Specification&variables=r%3D3.1415#output-text>
</noscript>

##### Scientific Form - `ESw.d`
<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+ES8.2&type=Format+Specification&variables=r%3D3.1415#output-text" class="embed-iframe" height="180" title='10 FORMAT("Value:", ES8.2) WRITE(*, 10) 3.1415 ! OUTPUTS "Value:3.14E+00"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+ES8.2&type=Format+Specification&variables=r%3D3.1415#output-text>
</noscript>

##### Engineering Form - `ENw.d`

<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+EN12&type=Format+Specification&variables=r%3D10000#output-text" class="embed-iframe" height="180" title='10 FORMAT("Value:", EN12) WRITE(*, 10) 10000 ! OUTPUTS "Value:     10.E+03"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+EN12&type=Format+Specification&variables=r%3D10000#output-text>
</noscript>

The only difference between engineering notation and scientific notation is that engineering notation uses multiples of three. Contrast with `ES` of the same number:
<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+ES12&type=Format+Specification&variables=r%3D10000#output-text" class="embed-iframe" height="180" title='10 FORMAT("Value:", ES12) WRITE(*, 10) 10000 ! OUTPUTS "Value:      1.E+04"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+ES12&type=Format+Specification&variables=r%3D10000#output-text>
</noscript>

##### Hexadecimal Significand - `EX`
<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+EX12&type=Format+Specification&variables=r%3D10000#output-text" class="embed-iframe" height="180" title='10 FORMAT("Value:", EX12) WRITE(*, 10) 10000 ! OUTPUTS "Value:  0X9.C4P+10"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+EX12&type=Format+Specification&variables=r%3D10000#output-text>
</noscript>

##### Digits in Exponent - `Ee`

`Ee` can be appended to any real-number edit descriptor that has an exponential component, where `E` is an edit descriptor of exponential form, and `e` the number of digits to be shown in the exponent. For instance, in specifying the exponential form edit descriptor's exponent:

<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+E10.2E3&type=Format+Specification&variables=r%3D3.1415#output-text" class="embed-iframe" height="180" title='10 FORMAT("Value:", E10.2E3) WRITE(*, 10) 3.1415 ! OUTPUTS "Value: 0.31E+001"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+E10.2E3&type=Format+Specification&variables=r%3D3.1415#output-text>
</noscript>

##### Generalized Edit Descriptor - `Gw.d`

Automatically selects an appropriate underlying data descriptor:

<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=G10.2%2C+G8.2%2C+G3&type=Format+Specification&variables=r%3D1000002.04%3Br%3D12%3Bs%3D%22+Te%22#output-text" class="embed-iframe" height="180" title='10 FORMAT(G10.2, G8.2, G3) WRITE(*, 10) 1000002.04, 12, " Te" ! OUTPUTS "  0.10E+07 12.     Te"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=G10.2%2C+G8.2%2C+G3&type=Format+Specification&variables=r%3D1000002.04%3Br%3D12%3Bs%3D%22+Te%22#output-text>
</noscript>

#### Characters

##### Character - `Aw`

<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+A&type=Format+Specification&variables=s%3D%22Howdy%22#output-text" class="embed-iframe" height="180" title='10 FORMAT("Value:", A) WRITE(*, 10) "Howdy" ! OUTPUTS "Value:Howdy"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+A&type=Format+Specification&variables=s%3D%22Howdy%22#output-text>
</noscript>

You can set a maximum number of characters with `Aw`. These truncate if width is exceeded:
<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+A3&type=Format+Specification&variables=s%3D%22Howdy%22#output-text" class="embed-iframe" height="180" title='10 FORMAT("Value:", A3) WRITE(*, 10) "Howdy" ! OUTPUTS "Value:How"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22Value%3A%22%2C+A3&type=Format+Specification&variables=s%3D%22Howdy%22#output-text>
</noscript>

##### Hollerith Constants - `wH`

Before the `A` format descriptor (introduced in FORTRAN 66), there were [Hollerith Constants](https://en.wikipedia.org/wiki/Hollerith_constant), which have existed since the first FORTRAN manual[^manual]:

<iframe tabindex="-1" src="
https://ambiguous.name/fortran-format-web-demo/?stmt=4HTest&type=Format+Specification&variables=#output-text" class="embed-iframe" height="180" title='10 FORMAT(4HTest) WRITE(*, 10) ! OUTPUTS "Test"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=4HTest&type=Format+Specification&variables=#output-text>
</noscript>

#### Logicals - `L`

Booleans in FORTRAN:

<iframe tabindex="-1" src="
https://ambiguous.name/fortran-format-web-demo/?stmt=%22This+statement+is+%22%2C+L&type=Format+Specification&variables=l%3D.TRUE.#output-text" class="embed-iframe" height="180" title='10 FORMAT("This statement is ", L) WRITE(*, 10) .TRUE. ! OUTPUTS "This statement is T"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22This+statement+is+%22%2C+L&type=Format+Specification&variables=l%3D.TRUE.#output-text>
</noscript>

##### Logical Width - `Lw`

You can also set the width of logicals for whatever reason:
<iframe tabindex="-1" src="
https://ambiguous.name/fortran-format-web-demo/?stmt=%22This+statement+is+%22%2C+L2&type=Format+Specification&variables=l%3D.TRUE.#output-text" class="embed-iframe" height="180" title='10 FORMAT("This statement is ", L2) WRITE(*, 10) .TRUE. ! OUTPUTS "This statement is  T"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=%22This+statement+is+%22%2C+L2&type=Format+Specification&variables=l%3D.TRUE.#output-text>
</noscript>

#### Representations

##### Binary `Bw.m`
Represents any variable in its binary form:
<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=B80.47&type=Format+Specification&variables=s%3D%22Hello%21%22#output-text" class="embed-iframe" height="180" title='10 FORMAT(B80.47) WRITE(*, 10) "Hello!" ! OUTPUTS "                                 01000010110111101101100011011000110010101001000"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=B80.47&type=Format+Specification&variables=s%3D%22Hello%21%22#output-text>
</noscript>


##### Octal `Ow.m`
Represents any variable in its octal form:
<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=O20&type=Format+Specification&variables=i%3D200#output-text" class="embed-iframe" height="180" title='10 FORMAT(O20) WRITE(*, 10) 200 ! OUTPUTS "                 310"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=O20&type=Format+Specification&variables=i%3D200#output-text>
</noscript>

##### Hexadecimal `Zw.m`
Represents any variable in its hexadecimal form:
<iframe tabindex="-1" src="https://ambiguous.name/fortran-format-web-demo/?stmt=Z30&type=Format+Specification&variables=r%3D162.04#output-text" class="embed-iframe" height="180" title='10 FORMAT(Z30) WRITE(*, 10) 162.04 ! OUTPUTS "              40644147AE147AE1"'>
</iframe>
<noscript>
<https://ambiguous.name/fortran-format-web-demo/?stmt=Z30&type=Format+Specification&variables=r%3D162.04#output-text>
</noscript>

## Conclusion

FORTRAN's edit descriptors offer something of a strange deviation to the string formatting that you might be familiar with in other languages. This post should hopefully offer a limited example of how you might be able to begin to work with different data types, at least when it comes to interfacing with variables directly.

For brevity, this post does not cover "Control Edit Descriptors", which do not directly display variable outputs or inputs. Nor does it cover edit descriptors in a context of recieving input.

If I've made a mistake with any of the above, or if you're interested in seeing more FORTRAN I/O coverage in this space, please reach out! My email is <code>ambiguousname (at) ambiguous.name</code>.

In the meantime, feel free to use the [FORTRAN WASM demo](https://ambiguous.name/fortran-format-web-demo/) for any purposes you might have. Thank you for your time!

{%comment%}
<!--
### Control Edit Descriptors


#### Position Editing

##### Tabbing


##### Next Character - `nX`


#### End of Data Transfer - `/`

#### Terminate Formatting - `:`

#### Sign Control

##### Scale Factor - `P`

#### Blank Control

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
-->
{%endcomment%}

## Sources
All of the following were utilized heavily when referencing the behavior of FORTRAN functions:
- [Intel's Fortran Documentation](https://www.intel.com/content/www/us/en/docs/fortran-compiler/developer-guide-reference/2023-0/overview.html)
- [GNU's Fortran Docs](https://gcc.gnu.org/onlinedocs/gfortran/index.html#SEC_Contents) 
- [Oracle's FORTRAN 77 Reference](https://docs.oracle.com/cd/E19957-01/805-4939/index.html)

For describing the intended behaviors of FORTRAN, both [The Computer History museum's archive of the first FORTRAN manual](https://archive.computerhistory.org/resources/text/Fortran/102649787.05.01.acc.pdf) and [fortran90.org/wg5-fortran.org's archive of FORTRAN standards](https://www.fortran90.org/) were extremely useful.

Since it is also the basis of the web demo, I've used the [LLVM Fortran Runtime docs/source code extensively](https://github.com/llvm/llvm-project/tree/main/flang).

The [FORTRAN logo is from FORTRAN's own GitHub page](https://github.com/fortran-lang/fortran-lang.org/blob/master/assets/img/fortran-logo.svg).