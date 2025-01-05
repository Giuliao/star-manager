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

    if (!acc[item.tag_user_relations.id]) {
      acc[item.tag_user_relations.id] = {
        id: item.tag_user_relations.id,
        parentId: item.tag_user_relations.parent_id,
        tagId: item.tags.id,
        title: item.tags.name as string,
        content: item.tag_user_relations.content || undefined,
        parentTagId: item.tag_user_relations.parent_tag_id || undefined,
        items: [
          ...(acc[item.tags.id]?.items || [])
        ]
      }
    } else {
      acc[item.tag_user_relations.id].content = item.tag_user_relations.content as string[];
      acc[item.tag_user_relations.id].title = item.tags.name as string;
      acc[item.tag_user_relations.id].tagId = item.tags.id
      acc[item.tag_user_relations.id].parentTagId = item.tag_user_relations.parent_tag_id || undefined;
      acc[item.tag_user_relations.id].parentId = item.tag_user_relations.parent_id;
    }

    if (item.tag_user_relations.parent_id) {
      if (acc[item.tag_user_relations.parent_id]) {
        acc[item.tag_user_relations.parent_id].items!.push(acc[item.tag_user_relations.id]);
      } else {
        acc[item.tag_user_relations.parent_id] = {
          id: item.tag_user_relations.parent_id,
          parentId: null,
          parentTagId: item.tag_user_relations.parent_tag_id || undefined,
          title: "",
          items: [acc[item.tag_user_relations.id]]
        }
      }
    }
    return acc;
  }, {} as Record<string, NavTagItem>);

  let parsedData: NavTagItem[] = [];
  Object.values(navTree).forEach(item => {
    if (!item.parentId) {
      parsedData.push(item);
    }
  });

  return parsedData;
}


