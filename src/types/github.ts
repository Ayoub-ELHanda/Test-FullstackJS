
// For example: { id: 583231, login: "octocat", avatar_url: "...", html_url: "..." }

export interface GithubUser {
  id: number;  
  login: string;
  avatar_url: string;
  html_url: string;
}


// This describes the full response from the GitHub search endpoint.

export interface GithubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GithubUser[];
}

// UserItem is what we store in our LOCAL list (the cards on screen).

export interface UserItem extends GithubUser {
  key: string;     
  selected: boolean;
}


// SearchStatus describes every possible state the search can be in.
export type SearchStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'no-results'
  | 'rate-limited'
  | 'error';