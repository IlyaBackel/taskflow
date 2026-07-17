export interface Board {
  id: string;
  title: string;
  owner_id: string;
  created_at: string;
}

// export interface BoardWithOwner extends Board {
//   owner: Profile;
// }