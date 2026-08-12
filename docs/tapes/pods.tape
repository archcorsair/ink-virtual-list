# Showcase recording for docs. Regenerate from the repo root with:
#   vhs docs/tapes/pods.tape
# Requires vhs, ttyd, and ffmpeg on PATH.

Output docs/public/pods.gif

Set Shell "bash"
Set FontSize 15
Set Width 720
Set Height 380
Set Padding 14
Set Framerate 24

Hide
Type "clear && bun examples/pods.tsx"
Enter
Sleep 3s
Show

Sleep 1.2s
Type@90ms "jjjjjjjj"
Sleep 900ms
Type "G"
Sleep 2s
Type "g"
Sleep 1.8s
Type@90ms "jjjj"
Sleep 1.2s

Hide
Type "q"
