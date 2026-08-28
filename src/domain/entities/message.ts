export interface Message {
  id: string;
  text: string;
  senderId: string;
  displayName: string;
  createdAt: Date | null;
}
