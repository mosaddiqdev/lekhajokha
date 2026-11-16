# Lekhajokha

A digital khata for local shops. The owner picks a customer, types an amount like on a calculator (`2*45 + 120`), saves, and the customer's baki updates. It works with no signal and keeps the data on the phone.

The first user is one neighbourhood shop. Customers never log in.

## Status

Built one small step at a time. Done so far: Steps 0 to 4.

| Step | What | Done |
| --- | --- | --- |
| 0 | Foundation | yes |
| 1 | Amount engine (`2*45 + 120` to paise) | yes |
| 2 | Data layer (customers, entries, baki) | yes |
| 3 | Design system and keypad | yes |
| 4 | Home: customer list, add and edit customer | yes |
| 5 | Customer ledger | |
| 6 | Add entry | |
| 7 | Edit and delete rules | |
| 8 | PIN, persistent storage, backup | |
| 9 | Summary | |
| 10 | Install and offline, try it in the shop | |

## Run it

You need Node 22.12 or newer.

```
npm install
npm run dev      # dev server, reachable from your phone on the same wifi
npm test         # unit tests
npm run build    # type check, then production build in dist/
npm run format   # Biome lint and format
```

## Layout

```
src/
  engine/     amount parser, baki rule, rupee format, keypad rules, customer checks, list order. No React, no browser APIs.
  data/       the phone database (Dexie): customers, entries, baki per customer
  ui/         Button, Amount, Keypad, BottomSheet, TextField, Segmented, TopBar. Each has its own CSS module.
  app/        routes (the URL hash) and screen transitions
  home/       the customer list, search and the shop total
  customer/   add, edit and delete customer; a stand-in ledger until Step 5
  styles/     tokens.css (all colours), base.css
```

More folders arrive with the steps that need them. Conventions are in [CODE_STYLE.md](CODE_STYLE.md).
