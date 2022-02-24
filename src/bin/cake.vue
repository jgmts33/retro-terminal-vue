<template lang="pug">
.cake
    stdio.cake__shell(:history='history' :inputting='!!resolveInput' @submit='handleInput')
    pre.cake__art {{ art }}
</template>

<script>
import _ from 'lodash'
import sleep from 'sleep-promise'
import { markRaw } from 'vue'
import { mapState, mapMutations } from 'vuex'

import Kernel from '@/components/Kernel'
import StillAlive from '@/sounds/still-alive.mp3'

const Art = {
    APERTURE: `             .,-:;//;:=,
         . :H@@@MM@M#H/.,+%;,
      ,/X+ +M@@M@MM%=,-%HMMM@X/,
     -+@MM; $M@@MH+-,;XMMMM@MMMM@+-
    ;@M@@M- XM@X;. -+XXXXXHHH@M@M#@/.
  ,%MM@@MH ,@%=            .---=-=:=,.
  -@#@@@MX .,              -%HX$$%%%+;
 =-./@M@M$                  .;@MMMM@MM:
 X@/ -$MM/                    .+MM@@@M$
,@M@H: :@:                    . -X#@@@@-
,@@@MMX, .                    /H- ;@M@M=
.H@@@@M@+,                    %MM+..%#$.
 /MMMM@MMH/.                  XM@MH; -;
  /%+%$XHH@$=              , .H@@@@MX,
   .=--------.           -%H.,@@@@@MX,
   .%MM@@@HHHXX$$$%+- .:$MMX -M@@MM%.
     =XMMM@MM@MM#H;,-+HMM@M+ /MMMX=
       =%@M@M#@$-.=$@MM@@@M; %M%=
         ,:+$+-,/H#MMMMMMM@- -,
               =++%%%%+/:-.`,
    DANGER: `             =+$HM####@H%;,
          /H###############M$,
          ,@################+
           .H##############+
             X############/
              $##########/
               %########/
                /X/;;+X/

                 -XHHX-
                ,######,
#############X  .M####M.  X#############
##############-   -//-   -##############
X##############%,      ,+##############X
-##############X        X##############-
 %############%          %############%
  %##########;            ;##########%
   ;#######M=              =M#######;
    .+M###@,                ,@###M+.
       :XH.                  .HX:`,
    ATOM: `                 =/;;/-
                +:    //
               /;      /;
              -X        H.
.//;;;:;;-,   X=        :+   .-;:=;:;%;.
M-       ,=;;;#:,      ,:#;;:=,       ,@
:%           :%.=/++++/=.$=           %=
 ,%;         %/:+/;,,/++:+/         ;+.
   ,+/.    ,;@+,        ,%H;,    ,/+,
      ;+;;/= @.  .H##X   -X :///+;
      ;+=;;;.@,  .XM@$.  =X.//;=%/.
   ,;:      :@%=        =$H:     .+%-
 ,%=         %;-///==///-//         =%,
;+           :%-;;;;;;;;-X-           +:
@-      .-;;;;M-        =M/;;;-.      -X
 :;;::;;-.    %-        :+    ,-;;-;:==
              ,X        H.
               ;/      %=
                //    +;
                 ,////,`,
    HEART: `                          .,---.
                        ,/XM#MMMX;,
                      -%##########M%,
                     -@######%  $###@=
      .,--,         -H#######$   $###M:
   ,;$M###MMX;     .;##########$;HM###X=
,/@###########H=      ;################+
-+#############M/,      %##############+
%M###############=      /##############:
H################      .M#############;.
@###############M      ,@###########M:.
X################,      -$=X#######@:
/@##################%-     +######$-
.;##################X     .X#####+,
 .;H################/     -X####+.
   ,;X##############,       .MM/
      ,:+$H@M#######M#$-    .$$=
           .,-=;+$@###X:    ;/=.
                  .,/X$;   .::,
                      .,    ..`,
    FIRE: `                     -$-
                    .H##H,
                   +######+
                .+#########H.
              -$############@.
            =H###############@  -X:
          .$##################:  @#@-
     ,;  .M###################;  H###;
   ;@#:  @###################@  ,#####:
 -M###.  M#################@.  ;######H
 M####-  +###############$   =@#######X
 H####$   -M###########+   :#########M,
  /####X-   =########%   :M########@/.
    ,;%H@X;   .$###X   :##MM@%+;:-
                 ..
  -/;:-,.              ,,-==+M########H
 -##################@HX%%+%%$%%%+:,,
    .-/H%%%+%%$H@###############M@+=:/+:
/XHX%:#####MH%=    ,---:;;;;/&&XHM,:###$
$@#MX %+;-                           .`,
    CHECK: `                                     :X-
                                  :X###
                                ;@####@
                              ;M######X
                            -@########$
                          .$##########@
                         =M############-
                        +##############$
                      .H############$=.
         ,/:         ,M##########M;.
      -+@###;       =##########M;
   =%M#######;     :#########M/
-$M###########;   :########/
 ,;X###########; =#######$.
     ;H#########+######M=
       ,+#############+
          /M########@-
            ;M#####%
              +####:
               ,$M-`,
    EXPLOSION: `            .+
             /M;
              H#@:              ;,
              -###H-          -@/
               %####$.  -;  .%#X
                M#####+;#H :M#M.
..          .+/;%#############-
 -/%H%+;-,    +##############/
    .:$M###MH$%+############X  ,--=;-
        -/H#####################H+=.
           .+#################X.
         =%M####################H;.
            /@###############+;;/%%;,
         -%###################$
       ;H######################M=
    ,%#####MH$%;+#####M###-/@####%
  :$H%+;=-      -####X.,H#   -+M##@-
 .              ,###;    ;      =$##+
                .#H,               :XH,
                 +                   .;-`,
    BLACKMESA: `           .-;+$XHHHHHHX$+;-.
        ,;X@@X%/;=----=:/%X@@X/,
      =$@@%=.              .=+H@X:
    -XMX:                      =XMX=
   /@@:                          =H@+
  %@X,                            .$@$
 +@X.                               $@%
-@@,                                .@@=
%@%                                  +@$
H@:                                  :@H
H@:         :HHHHHHHHHHHHHHHHHHX,    =@H
%@%         ;@M@@@@@@@@@@@@@@@@@H-   +@$
=@@,        :@@@@@@@@@@@@@@@@@@@@@= .@@:
 +@X        :@@@@@@@@@@@@@@@M@@@@@@:%@%
  $@$,      ;@@@@@@@@@@@@@@@@@M@@@@@@$.
   +@@HHHHHHH@@@@@@@@@@@@@@@@@@@@@@@+
    =X@@@@@@@@@@@@@@@@@@@@@@@@@@@@X=
      :$@@@@@@@@@@@@@@@@@@@M@@@@$:
        ,;$@@@@@@@@@@@@@@@@@@X/-
           .-;+$XXHHHHHX$+;-.`,
    CAKE: `            ,:/+/-
            /M/              .,-=;//;-
       .:/= ;MH/,    ,=/+%$XH@MM#@:
      -$##@+$###@H@MMM#######H:.    -/H#
 .,H@H@ X######@ -H#####@+-     -+H###@X
  .,@##H;      +XM##M/,     =%@###@X;-
X%-  :M##########$.    .:%M###@%:
M##H,   +H@@@$/-.  ,;$M###@%,          -
M####M=,,---,.-%%H####M$:          ,+@##
@##################@/.         :%H##@$-
M###############H,         ;HM##M$=
#################.    .=$M##M$=
################H..;XM##M$=          .:+
M###################@%=           =+@MH%
@#################M/.         =+H#X%=
=+M###############M,      ,/X#H+:,
  .;XM###########H=   ,/X#H+:;
     .=+HM#######M+/+HM@+=.
         ,:/%XM####H/.
              ,.:=-.`,
    GLADOS: `       #+ @      # #              M#@
 .    .X  X.%##@;# #   +@#######X. @H%
   ,==.   ,######M+  -#####%M####M-    #
  :H##M%:=##+ .M##M,;#####/+#######% ,M#
 .M########=  =@#@.=#####M=M#######=  X#
 :@@MMM##M.  -##M.,#######M#######. =  M
             @##..###:.    .H####. @@ X,
   ############: ###,/####;  /##= @#. M
           ,M## ;##,@#M;/M#M  @# X#% X#
.%=   ######M## ##.M#:   ./#M ,M #M ,#$
##/         $## #+;#: #### ;#/ M M- @# :
#+ #M@MM###M-;M #:$#-##$H# .#X @ + $#. #
      ######/.: #%=# M#:MM./#.-#  @#: H#
+,.=   @###: /@ %#,@  ##@X #,-#@.##% .@#
#####+;/##/ @##  @#,+       /#M    . X,
   ;###M#@ M###H .#M-     ,##M  ;@@; ###
   .M#M##H ;####X ,@#######M/ -M###$  -H
    .M###%  X####H  .@@MM@;  ;@#M@
      H#M    /@####/      ,++.  / ==-,
               ,=/:, .+X@MMH@#H  #####$=`,
}

const songStartOffset = 7900

const song = [
    { start: 7900, end: 9280, lyric: 'This was a triumph.' },
    { start: 11700, end: 15090, lyric: "I'm making a note here: HUGE SUCCESS." },
    { start: 16700, end: 20500, lyric: "It's hard to overstate my satisfaction." },
    {
        start: 24000, end: 25250, lyric: 'Aperture Science', art: Art.APERTURE,
    },
    { start: 27520, end: 28800, lyric: 'We do what we must' },
    { start: 29370, end: 31220, lyric: 'because we can.' },
    { start: 32800, end: 35950, lyric: 'For the good of all of us.' },
    {
        start: 36070, end: 37930, lyric: 'Except the ones who are dead.', art: Art.DANGER, theme: 'red',
    },
    {
        start: 38310, end: 42060, lyric: "But there's no sense crying over every mistake.", art: Art.APERTURE, theme: null,
    },
    { start: 42200, end: 46130, lyric: 'You just keep on trying till you run out of cake.' },
    {
        start: 46130, end: 48150, lyric: 'And the Science gets done.', art: Art.ATOM,
    },
    { start: 48180, end: 50070, lyric: 'And you make a neat gun.' },
    {
        start: 50300, end: 51830, lyric: 'For the people who are', art: Art.APERTURE,
    },
    { start: 52050, end: 53320, lyric: 'still alive.' },
    { start: 52900, theme: 'orange' },
    { start: 59560, end: 61240, lyric: "I'm not even angry." },
    { start: 63760, end: 67030, lyric: "I'm being so sincere right now." },
    { start: 68810, end: 72269, lyric: 'Even though you broke my heart.' },
    { start: 70810, art: Art.HEART },
    { start: 72270, end: 73510, lyric: 'And killed me.' },
    {
        start: 75590, end: 77180, lyric: 'And tore me to pieces.', art: Art.EXPLOSION, toggleGlitching: true,
    },
    {
        start: 79600, end: 82400, lyric: 'And threw every piece into a fire.', toggleGlitching: true,
    },
    { start: 82410, art: Art.FIRE },
    { start: 84840, end: 87900, lyric: 'As they burned it hurt because' },
    {
        start: 87960, end: 89820, lyric: 'I was so happy for you!', art: Art.CHECK, theme: 'green',
    },
    {
        start: 90000, end: 94230, lyric: 'Now these points of data make a beautiful line.',
    },
    { start: 94310, end: 96140, lyric: "And we're out of beta." },
    { start: 96400, end: 98000, lyric: "We're releasing on time." },
    {
        start: 98180, end: 100230, lyric: "So I'm GLaD. I got burned.", art: Art.EXPLOSION,
    },
    {
        start: 100300, end: 102300, lyric: 'Think of all the things we learned', art: Art.ATOM,
    },
    {
        start: 102330, end: 103800, lyric: 'for the people who are', art: Art.APERTURE,
    },
    { start: 104100, end: 105690, lyric: 'still alive.' },
    {
        start: 111860, end: 113750, lyric: 'Go ahead and leave me.', theme: null,
    },
    { start: 115500, end: 119170, lyric: 'I think I prefer to stay inside.' },
    { start: 120840, end: 125420, lyric: "Maybe you'll find someone else to help you." },
    { start: 127500, end: 129460, lyric: 'Maybe Black Mesa' },
    { start: 128370, art: Art.BLACKMESA },
    { start: 131500, end: 133000, lyric: 'THAT WAS A JOKE.' },
    { start: 134250, end: 135370, lyric: 'FAT CHANCE.' },
    { start: 136900, end: 139990, lyric: 'Anyway, this cake is great.' },
    { start: 138360, art: Art.CAKE },
    { start: 140000, end: 141960, lyric: "It's so delicious and moist." },
    {
        start: 142370, end: 144280, lyric: 'Look at me still talking', art: Art.GLADOS, theme: 'orange',
    },
    {
        start: 144380, end: 146140, lyric: "when there's Science to do.", art: Art.ATOM,
    },
    {
        start: 146400, end: 148140, lyric: 'When I look out there', art: Art.APERTURE,
    },
    { start: 148150, end: 150240, lyric: "it makes me GLaD I'm not you." },
    {
        start: 150380, end: 152280, lyric: "I've experiments to run.", art: Art.ATOM,
    },
    {
        start: 152390, end: 154000, lyric: 'There is research to be done.', art: Art.EXPLOSION,
    },
    {
        start: 154390, end: 155800, lyric: 'On the people who are', art: Art.APERTURE,
    },
    { start: 156080, end: 157530, lyric: 'still alive.' },
    { start: 158200, end: 159940, lyric: 'And believe me I am' },
    { start: 160000, end: 161280, lyric: 'still alive.' },
    { start: 162000, end: 163980, lyric: "I'm doing Science and I'm" },
    { start: 164220, end: 165090, lyric: 'still alive.' },
    { start: 166100, end: 168030, lyric: "I feel FANTASTIC and I'm" },
    { start: 168000, end: 169270, lyric: 'still alive.' },
    { start: 170370, end: 172030, lyric: "While you're dying I'll be" },
    { start: 172040, end: 173200, lyric: 'still alive.' },
    { start: 174100, end: 175960, lyric: "And when you're dead I will be" },
    { start: 176140, end: 177170, lyric: 'still alive.' },
    { start: 178060, end: 179200, lyric: 'STILL ALIVE' },
]

export default {
    name: 'Cake',

    extends: Kernel,

    data() {
        return {
            art: '',
            audio: null,
        }
    },

    computed: {
        ...mapState({
            sound: (state) => state.sound,
        }),
    },

    methods: {
        async run() {
            await Promise.all([
                this.ensureSound(),
                this.loadAudio(),
            ])

            await this.runSong()
            this.clear()
            await this.output('still alive.', { delay: 0, speak: false })
            await sleep(1000)
            this.art = ''
            this.print(`


Still Alive is (C)2007 Valve. If you haven't played Portal, you absolutely should.
`)
            await this.promptAnyKey()
            this.setTheme(null)
        },

        async ensureSound() {
            if (!this.sound) {
                await this.output('Cake is best served with sound on. Turn on sound? [Y/N]: ')
                const response = (await this.input()).toUpperCase()
                if (response[0] === 'Y' && !this.sound) this.toggleSound()
            }
        },

        loadAudio() {
            return new Promise((resolve) => {
                this.audio = markRaw(new Audio(StillAlive))
                this.audio.oncanplaythrough = resolve
            })
        },

        setAudioVolume() {
            this.audio.volume = this.sound ? 1.0 : 0.0
        },

        runSong() {
            this.clear()
            this.setAudioVolume()
            this.audio.play()
            return new Promise((resolve) => {
                _.each(song, (part) => {
                    setTimeout(() => this.runPart(part), part.start - songStartOffset)
                })
                setTimeout(resolve, song[song.length - 1].end - songStartOffset + 970)
            })
        },

        async runPart(part) {
            if (part.art) this.art = part.art
            if (part.toggleGlitching) this.toggleGlitching()
            if (part.theme !== undefined) this.setTheme(part.theme)
            if (part.lyric) {
                await this.output(part.lyric, {
                    delay: 0,
                    speed: (part.end - part.start) / part.lyric.length,
                    speak: false,
                })
            }
        },

        ...mapMutations(['toggleGlitching', 'toggleSound', 'setTheme']),
    },

    watch: {
        sound() {
            if (this.audio) this.setAudioVolume()
        },
    },
}
</script>

<style lang="scss" scoped>
.cake {
    &__art {
        font-family: 'VT323', monospace;
        position: fixed;
        top: 20px;
        right: 40px;
        font-size: 24px;

        @media(max-width: 1000px) {
            font-size: 18px;
        }

        @media(max-width: 900px) {
            font-size: 10px;
            background: #00000099;
            padding: 10px;
        }
    }
}
</style>
