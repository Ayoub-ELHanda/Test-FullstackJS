# Github User Search

A React app to search GitHub users using the GitHub Search API.

## Stack

- Vite + React + TypeScript
- No UI libraries — CSS from scratch
- Vitest + Testing Library for tests

## Getting started

```bash
npm install
npm run dev
```

## Features

- Search as you type (debounced 400ms)
- Infinite scroll to load more results
- Request caching — same query won't hit the API twice
- Handles edge cases: no results, rate limit, network error, rapid typing
- Edit mode: select cards, then duplicate or delete them
- Responsive grid (2 to 6 columns depending on screen width)

## Project structure

```
src/
  components/
    SearchInput/     # controlled text input
    UserCard/        # single result card
    UserGrid/        # grid + status states (skeleton, error, no results)
    Toolbar/         # select-all, duplicate, delete actions
  hooks/
    useDebounce             # delays the search until typing stops
    useGithubSearch         # fetches from GitHub, manages cache + AbortController
    useIntersectionObserver # triggers loadMore when scrolled to bottom
  types/
    github.ts        # TypeScript interfaces for the GitHub API
```

## Tests

```bash
npm test           # watch mode
npm run test:run   # run once and exit
```

A git pre-push hook runs the tests automatically before every push. If tests fail, the push is blocked.

## Notes

- `userItems` (local list) is kept separate from the API data so duplicate/delete don't trigger a re-fetch
- Cards get a `key` field distinct from `id` so duplicated cards don't confuse React
- `effectiveQuery` falls back to `followers:>1000` when the input is under 2 characters, so the page isn't empty on load
