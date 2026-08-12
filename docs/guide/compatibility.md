# Compatibility

## Ink

`ink-virtual-list` supports Ink `^6.0.0 || ^7.0.0`. Both majors are tested in CI on every push — the full test suite runs against each.

Ink 7's breaking changes (input key handling, runtime floors) don't touch the API surface this library uses, so behavior is identical on both majors.

## React and Node

The `react` peer range is `^19.0.0`, but Ink imposes its own floor on top of that:

| Ink major | React        | Node   |
| --------- | ------------ | ------ |
| `^6.0.0`  | `>=19.0.0`   | ≥ 20   |
| `^7.0.0`  | `>=19.2.0`   | ≥ 22   |

Install whichever Ink major you want and let its peer requirements pull in the React and Node versions it needs — this library follows along.

## JSR

::: warning JSR resolves against Ink 6
JSR's manifest format accepts only a single version requirement per dependency — it rejects multi-major ranges like `^6.0.0 || ^7.0.0`. The [JSR package](https://jsr.io/@archcorsair/ink-virtual-list) therefore declares `npm:ink@^6.0.0`, so JSR consumers resolve against Ink 6. The npm package carries the full dual range, and the source works with either major.
:::

## API Docs on JSR

JSR auto-renders API documentation from the library's JSDoc: [jsr.io/@archcorsair/ink-virtual-list/doc](https://jsr.io/@archcorsair/ink-virtual-list/doc).
