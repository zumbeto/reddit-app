export interface NavigationState {
  query: string;
  shouldNavigate: boolean;
  subreddit: string;
  currentPostId: string | null;
  previousRoute: string | null;
  previousSearchQuery: string | null;
}
