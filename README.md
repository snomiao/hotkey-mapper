# Hotkey-mapper

a simply frontend hotkey-mapper

## Usage

```typescript
import hotkeyMapper from 'hotkey-mapper'
const unloadHotkeyMaps = hotkeyMapper({
    "alt+i": () => console.log('init-task'),
    "alt+t": () => console.log('tag'),
    "alt+n": () => console.log('next-task'),
    "alt+u": () => console.log('user'),
    "ctrl+alt+c": () => console.log('code-action'),
});
await new Promise(r => setTimeout(r, 60e3)) // wait 1 min
unloadHotkeyMaps()
```

### or import by script

```html
<script src="https://cdn.jsdelivr.net/npm/hotkey-mapper/dist/index.umd.js" > </script>
<script>
const hotkeyMapper = hotkeyMapper.hotkeyMapper
const unloadHotkeyMaps = hotkeyMapper({
    "alt+i": () => console.log('init-task'),
    "alt+t": () => console.log('tag'),
    "alt+n": () => console.log('next-task'),
    "alt+u": () => console.log('user'),
    "ctrl+alt+c": () => console.log('code-action'),
});
</script>
```

## About

### License

MIT

### Author

Author: snomiao <snomiao@gmail.com>
Website: [snomiao.com](https://snomiao.com)

### Sponsors

- None yet.
    
Claim your sponsorship by donating snomiao <[Email: snomiao@gmail.com](mailto:snomiao@gmail.com)>

### Contribute

The main repo is in [here](https://github.com/snomiao/js#readme), any issue and PR's welcome.
