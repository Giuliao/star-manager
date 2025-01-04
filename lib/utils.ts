import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { NavTagItem } from "@/types/tag"
import type { UserTagListType } from './actions/tag'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseTagData(data: UserTagListType) {
  const navTree = data.reduce((acc, item) => {
    if (!item.tags) {
      return acc;
    }

    if (!acc[item.tags.id]) {
      acc[item.tags.id] = {
        id: item.tags.id,
        title: item.tags.name as string,
        content: item.tag_user_relations.content || undefined,
        parentId: item.tag_user_relations.parent_tag_id || undefined,
        items: [
          ...(acc[item.tags.id]?.items || [])
        ]
      }
    } else {
      acc[item.tags.id].content = item.tag_user_relations.content as string[];
      acc[item.tags.id].title = item.tags.name as string;
      acc[item.tags.id].id = item.tags.id
      acc[item.tags.id].parentId = item.tag_user_relations.parent_tag_id || undefined;
    }

    if (item.tag_user_relations.parent_tag_id) {
      if (acc[item.tag_user_relations.parent_tag_id]) {
        acc[item.tag_user_relations.parent_tag_id].items!.push(acc[item.tags.id]);
      } else {
        acc[item.tag_user_relations.parent_tag_id] = {
          id: item.tag_user_relations.parent_tag_id,
          title: "",
          items: [acc[item.tags.id]]
        }
      }
    }
    return acc;
  }, {} as Record<number, NavTagItem>);

  let parsedData: NavTagItem[] = [];
  Object.values(navTree).forEach(item => {
    if (!item.parentId) {
      parsedData.push(item);
    }
  });

  return parsedData;
}


