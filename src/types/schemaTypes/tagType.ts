export interface TagType {
  name: string;
  type: 'rule' | 'code' | 'info';
  content: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
