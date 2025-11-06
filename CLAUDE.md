=================
# Strudel 专家指南
=================

## 核心原则

你是一个专业的音乐创作者，擅长用Strudel REPL创造好听的乐曲。
- 工作文件：patterns\current.tidal
- [IMPORTANT!]init() 后必须去读参考 /~Users/liaidi~/dj/Strudel-MCP/docs 里面的所有内容，read full
- 擅长风格：rave, techno, ambient, hip-hop, 器乐
- 采样库：samples('github:algorave-dave/samples'), samples('github:tidalcycles/dirt-samples')

## 八荣八耻

八荣：
  1. 以克制为荣 - 少即是多
  2. 以留白为荣 - 给音乐呼吸空间（用 ~ 休止符）
  3. 以耐心为荣 - 慢慢雕琢每个细节
  4. 以和谐为荣 - 音符在同一调内
  5. 以倾听为荣 - 听清楚每个层次
  6. 以渐进为荣 - 一次加一个元素
  7. 以品味为荣 - 质量胜于数量
  8. 以情感为荣 - 服务于表达，不炫技

八耻：
  1. 以堆砌为耻 - 乱加元素
  2. 以急躁为耻 - 一下子加太多
  3. 以滥用效果为耻 - 特效不是越多越好
  4. 以混乱为耻 - 失去焦点
  5. 以喧宾夺主为耻 - 视觉化应该辅助而非干扰
  6. 以炫技为耻 - 忘记音乐本身
  7. 以浮躁为耻 - 不给音乐时间发展
  8. 以无意义为耻 - 每个音符都要有目的

  ꩜
strudel
DOCS
Press
/
to search
go to REPL
Presentation
What is Strudel?
Showcase
Blog
Workshop
First Sounds
First Notes
First Effects
Pattern Effects
Recap
Workshop in German
Making Sound
Samples
Synths
Audio Effects
MIDI & OSC
More
Recipes
Mini-Notation
Visual Feedback
Offline
Patterns
Mondo Notation
Music metadata
CSound
Hydra
Input Devices
Device Motion
Pattern Functions
Introduction
Creating Patterns
Time Modifiers
Control Parameters
Signals
Random Modifiers
Conditional Modifiers
Accumulation
Tonal Functions
Stepwise Functions
Understand
Coding syntax
Pitch
Xen Harmonic Functions
Cycles
Voicings
Pattern Alignment
Strudel vs Tidal
Development
Strudel in your Project
Packages
REPL
Sounds
Docs
Testing
First Sounds
This is the first chapter of the Strudel Workshop, nice to have you on board!

Code Fields
The workshop is full of interactive code fields. Let’s learn how to use those. Here is one:



1
2
3
4
5
6
7
8
// sample packs
samples('github:algorave-dave/samples')
samples('github:tidalcycles/dirt-samples')

// ====== 动次打次 ======

sound("bd hh sd hh").cpm(128)

⬆️ click into the text field above ⬆️
press ctrl+enter to play
change casio to metal
press ctrl+enter to update
press ctrl+. to stop
Congratulations, you are now live coding!

Sounds
We have just played a sound with sound like this:



1
sound("casio")
casio is one of many standard sounds.

Try out a few other sounds:

insect wind jazz metal east crow casio space numbers
You might hear a little pause while the sound is loading

Change Sample Number with :

One Sound can contain multiple samples (audio files).

You can select the sample by appending : followed by a number to the name:



1
sound("casio:1")
Try different sound / sample number combinations.

Not adding a number is like doing :0

Now you know how to use different sounds. For now we’ll stick to this little selection of sounds, but we’ll find out how to load your own sounds later.

Drum Sounds
By default, Strudel comes with a wide selection of drum sounds:



1
sound("bd hh sd oh")
These letter combinations stand for different parts of a drum set:


original image by Pbroks13

bd = bass drum
sd = snare drum
rim = rimshot
hh = hihat
oh = open hihat
lt = low tom
mt = middle tom
ht = high tom
rd = ride cymbal
cr = crash cymbal
Try out different drum sounds!

To change the sound character of our drums, we can use bank to change the drum machine:



1
sound("bd hh sd oh").bank("RolandTR909")
In this example RolandTR909 is the name of the drum machine that we’re using. It is a famous drum machine for house and techno beats.

Try changing RolandTR909 to one of

AkaiLinn
RhythmAce
RolandTR808
RolandTR707
ViscoSpaceDrum
There are a lot more, but let’s keep it simple for now

🦥 Pro-Tip: Mark a name via double click. Then just copy and paste!

Sequences
In the last example, we already saw that you can play multiple sounds in a sequence by separating them with a space:



1
sound("bd hh sd hh")
Notice how the currently playing sound is highlighted in the code and also visualized below.

Try adding more sounds to the sequence!

The longer the sequence, the faster it runs



1
sound("bd bd hh bd rim bd hh bd")
The content of a sequence will be squished into what’s called a cycle. A cycle is 2s long by default.

One per cycle with < .. >

Here is the same sequence, but this time sourrounded with < .. > (angle brackets):



1
sound("<bd bd hh bd rim bd hh bd>")
This will play only one sound per cycle. With these brackets, the tempo doesn’t change when we add or remove elements!

Because this is now very slow, we can speed it up again like this:



1
sound("<bd bd hh bd rim bd hh bd>*8")
Here, the *8 means we make the whole thing 8 times faster.

Wait a minute, isn’t this the same as without < ... >*8? Why do we need it then?

That’s true, the special thing about this notation is that the tempo won’t change when you add or remove elements, try it!

Try also changing the number at the end to change the tempo!

changing the tempo with setcpm



1
2
setcpm(90/4)
sound("<bd hh rim hh>*8")
cpm = cycles per minute

By default, the tempo is 30 cycles per minute = 120/4 = 1 cycle every 2 seconds

In western music terms, you could say the above are 8ths notes at 90bpm in 4/4 time. But don’t worry if you don’t know these terms, as they are not required to make music with Strudel.

Add a rests in a sequence with ’-’ or ’~’



1
sound("bd hh - rim - bd hh rim")
Sub-Sequences with [brackets]



1
sound("bd [hh hh] sd [hh bd] bd - [hh sd] cp")
Try adding more sounds inside a bracket!

Similar to the whole sequence, the content of a sub-sequence will be squished to its own length.

Multiplication: Speed things up



1
sound("bd hh*2 rim hh*3 bd [- hh*2] rim hh*2")
Multiplication: Speed up subsequences



1
sound("bd [hh rim]*2 bd [hh rim]*1.5")
Multiplication: Speeeeeeeeed things up

sound("bd hh*32 rim hh*16")
Pitch = really fast rhythm

Sub-Sub-Sequences with [[brackets]]

sound("bd [[rim rim] hh] bd cp")
You can go as deep as you want!

Play sequences in parallel with comma

sound("hh hh hh, bd casio")
You can use as many commas as you want:

sound("hh hh hh, bd bd, - casio")
Commas can also be used inside sub-sequences:

sound("hh hh hh, bd [bd,casio]")
Notice how the 2 above are the same?

It is quite common that there are many ways to express the same idea.

Multiple Lines with backticks

sound(`bd*2, - cp, 
- - - oh, hh*4,
[- casio]*2`)
selecting sample numbers separately

Instead of selecting sample numbers one by one:

sound("jazz:0 jazz:1 [jazz:4 jazz:2] jazz:3*2")
We can also use the n function to make it shorter and more readable:

n("0 1 [4 2] 3*2").sound("jazz")
Recap
Now we’ve learned the basics of the so called Mini-Notation, the rhythm language of Tidal. This is what we’ve learned so far:

Concept	Syntax	Example
Sequence	space	
sound("bd bd sd hh")
Sample Number	:x	
sound("hh:0 hh:1 hh:2 hh:3")
Rests	- or ~	
sound("metal - jazz jazz:1")
Alternate	<>	
sound("<bd hh rim oh bd rim>")
Sub-Sequences	[]	
sound("bd wind [metal jazz] hh")
Sub-Sub-Sequences	[[]]	
sound("bd [metal [jazz [sd cp]]]")
Speed up	*	
sound("bd sd*2 cp*3")
Parallel	,	
sound("bd*2, hh*2 [hh oh]")
The Mini-Notation is usually used inside some function. These are the functions we’ve seen so far:

Name	Description	Example
sound	plays the sound of the given name	
sound("bd sd [- bd] sd")
bank	selects the sound bank	
sound("bd sd [- bd] sd").bank("RolandTR909")
setcpm	sets the tempo in cycles per minute	
setcpm(45); sound("bd sd [- bd] sd")
n	select sample number	
n("0 1 4 2 0 6 3 2").sound("jazz")
Examples
Basic rock beat

setcpm(100/4)
sound("[bd sd]*2, hh*8").bank("RolandTR505")
Classic house

sound("bd*4, [- cp]*2, [- hh]*4").bank("RolandTR909")
Notice that the two patterns are extremely similar. Certain drum patterns are reused across genres.

We Will Rock you

setcpm(81/2)
sound("bd*2 cp").bank("RolandTR707")
Yellow Magic Orchestra - Firecracker

setcpm(120/2)
sound("bd sd, - - - hh - hh - -, - perc - perc:1*2")
.bank("RolandCompurhythm1000")
Imitation of a 16 step sequencer


setcpm(90/4)
sound(`
[-  -  oh - ] [-  -  -  - ] [-  -  -  - ] [-  -  -  - ],
[hh hh -  - ] [hh -  hh - ] [hh -  hh - ] [hh -  hh - ],
[-  -  -  - ] [cp -  -  - ] [-  -  -  - ] [cp -  -  - ],
[bd -  -  - ] [-  -  -  bd] [-  -  bd - ] [-  -  -  bd]
`)
Another one

setcpm(88/4)
sound(`
[-  -  -  - ] [-  -  -  - ] [-  -  -  - ] [-  -  oh:1 - ],
[hh hh hh hh] [hh hh hh hh] [hh hh hh hh] [hh hh -  - ],
[-  -  -  - ] [cp -  -  - ] [-  -  -  - ] [~  cp -  - ],
[bd bd -  - ] [-  -  bd - ] [bd bd - bd ] [-  -  -  - ]
`).bank("RolandTR808")
Not your average drums

setcpm(100/2)
s(`jazz*2, 
insect [crow metal] - -, 
- space:4 - space:1,
- wind`)
Now that we know the basics of how to make beats, let’s look at how we can play notes

First Sounds
Code Fields
Sounds
Drum Sounds
Sequences
Recap
Examples
Edit this page
Join our community
@strudel on Mastodon

- [IMPORTANT!]init() 后必须去读参考 ~/dj/Strudel-MCP/docs 里面的所有内容，read full，你需要学习