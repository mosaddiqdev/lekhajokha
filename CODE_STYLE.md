# Code style

- Comment why, not what. `// Round to rupees: shops don't haggle over paise` helps. `// loop over entries` doesn't.
- Don't wrap try/catch or null checks around values our own code already checked. Guard the edges: browser storage, typed amounts, pasted text.
- No function that only forwards to another function. No class where a function would do.
- No `utils.ts` or `helpers.ts`. Put a function next to what uses it, or in a file named for what it does.
- Use the shop's words for names: `baki`, `jama`, `udhaar`, `entry`, `customer`. Not `data`, `result2`, `processItem`.
- Money is whole paise as an integer. Never a float.
- One component per file, around 150 lines at most. Past that, it's doing two jobs.
- `src/engine` has no React and no browser APIs. The amount parser gets a test there before any screen uses it.
- Balance (baki) is worked out from entries. It is never stored or typed by hand.
- Colours live only in `src/styles/tokens.css`. Each component owns a `*.module.css`.
- Delete code nobody uses. Git remembers it.

# Words in the app

Write like the shopkeeper talking, in short plain words.
- Say what happened. "Ramesh baki ₹240", not "Transaction recorded successfully".
- Buttons are verbs: "Udhaar diya", "Payment mila", "Save".
- No "seamless", "powerful", "effortless", "journey", "unlock".
- Few em dashes. A full stop works.
- Read it out loud. If it sounds like an advert, cut it.
