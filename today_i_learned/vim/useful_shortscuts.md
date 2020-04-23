# Shortcuts That I Find Myself Wanting to Use or Using Often

### cursory Movement

- `gg` - go to the first line of the document
- `G` - go to the last line of the document
- `w` - jump forwards to the start of a word
- `e` - jump forwards to the end of a word

### Cut and Paste

- `p` - put (paste) the clipboard after cursor
- `P` - put (paste) before cursor

### Visual Mode

- `V` - start linewise visual mode

### Inserting/Appending Text

- `o` - append (open) a new line below the current line
- `O` - append (open) a new line above the current line
- `a` - insert (append) after the cursor
- `A` - insert (append) at the end of the line

### Finding and Replacing

- `:'<,'>s/foo/bar/g` - while highlighting blocks in visual mode, change each 'foo' to 'bar' for all lines within a visual selection. Case sensitive
  - first, highlight block using `V` then enter `:s` and type out the exact pattern you want to find and replace, followed by what should replace it
