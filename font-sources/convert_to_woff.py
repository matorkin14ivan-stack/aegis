# Optional font conversion, not required to run the website.
# Requires fontTools: python -m pip install fonttools
from pathlib import Path
from fontTools.ttLib import TTFont
root = Path(__file__).resolve().parent
for source, destination in [
    ("P052-Roman.otf", "classical-serif.woff"),
    ("P052-Italic.otf", "classical-italic.woff"),
    ("NimbusSans-Regular.otf", "nimbus-sans.woff"),
    ("NimbusSans-Bold.otf", "nimbus-sans-bold.woff"),
]:
    font = TTFont(root / source)
    font.flavor = "woff"
    font.save(root.parent / "assets" / destination)
