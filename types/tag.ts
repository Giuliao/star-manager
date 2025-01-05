export type NavTagItem = {
  tagId?: number;
  parentTagId?: number;
  parentId: string | null;
  id?: string;
  title: string;
  icon?: React.ComponentType<any>;
  isActive?: boolean;
  items?: NavTagItem[];
  content?: string[]; // star item bind to tag
}

export type FlatTagType = {
  item: NavTagItem;
  name: string;
  indices: number[];
}
