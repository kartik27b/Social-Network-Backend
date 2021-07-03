export const getUploadPath = (userId: string) => {
  return 'uploads/user-' + userId;
};

export const getConversationHash = (id1: number, id2: number): string => {
  return Math.min(id1, id2).toString() + '-' + Math.max(id1, id2).toString();
};

export const serverUrl = 'localhost:3000';
