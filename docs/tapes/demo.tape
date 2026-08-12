# Hero recording for the docs landing page and README.
#
# Regenerate with VHS (https://github.com/charmbracelet/vhs):
#   vhs docs/tapes/demo.tape        # run from the repo root
# Requires vhs, ttyd, and ffmpeg on PATH. Output is written to docs/public/.

Output docs/public/demo.gif

Set Shell "bash"
Set FontSize 15
Set Width 720
Set Height 440
Set Padding 14
Set TypingSpeed 110ms

# Launch the demo off-screen so the recording opens on the running app
Hide
Type "clear && bun examples/demo.tsx"
Enter
Sleep 3s
Show

Sleep 1s

# Scroll down through the list - watch the viewport follow the selection
# and the overflow indicators appear without the layout shifting
Type "jjjjjjjjjjjjjjjj"
Sleep 900ms

# Jump to the bottom, then back to the top (imperative scrollToIndex via ref)
Type "G"
Sleep 1.2s
Type "g"
Sleep 1.2s

# Cycle height modes: tiny (height=2, indicators auto-disabled), then auto-fill
Type "t"
Sleep 1.5s
Type "t"
Sleep 1.8s

# Back to fixed height and a little more scrolling before the loop restarts
Type "t"
Sleep 800ms
Type "jjjj"
Sleep 1.2s

Hide
Type "q"
