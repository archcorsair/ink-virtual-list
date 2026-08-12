# Showcase recording for docs. Regenerate from the repo root with:
#   vhs docs/tapes/commits.tape
# Requires vhs, ttyd, and ffmpeg on PATH.

Output docs/public/commits.gif

Set Shell "bash"
Set FontSize 15
Set Width 720
Set Height 380
Set Padding 14
Set Framerate 15

Hide
Type "clear && bun examples/commits.tsx"
Enter
Sleep 3s
Show

Sleep 1.2s
Type@22ms "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj"
Sleep 700ms
Type@22ms "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj"
Sleep 1.6s

Hide
Type "q"
