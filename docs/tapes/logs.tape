# Showcase recording for docs. Regenerate from the repo root with:
#   vhs docs/tapes/logs.tape
# Requires vhs, ttyd, and ffmpeg on PATH.

Output docs/public/logs.gif

Set Shell "bash"
Set FontSize 15
Set Width 720
Set Height 380
Set Padding 14
Set Framerate 24

Hide
Type "clear && bun examples/logs.tsx"
Enter
Sleep 3s
Show

Sleep 1.2s
Type@40ms "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj"
Sleep 1s
Type "G"
Sleep 1.8s
Type "g"
Sleep 1.6s
Type@70ms "jjjjjj"
Sleep 1.2s

Hide
Type "q"
