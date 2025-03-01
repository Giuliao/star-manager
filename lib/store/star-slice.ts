import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { NavTagItem, FlatTagType } from "@/types/tag";
import type { StarItem } from "@/types/github";
import { rootReducer } from "./reducer";

// Define a type for the slice state
export interface StarState {
  tagList: NavTagItem[];
  selectedStar?: StarItem;
  selectedTag?: FlatTagType;
  isDeleteTag?: boolean;
  deletedTag?: NavTagItem[];
  selectedSidebarTag?: NavTagItem;
  editedTag?: NavTagItem;
  numOfStarItems?: number;
  numOfUntagStarItems?: number;
  contentRefresh?: boolean; // which switching content trigger refresh loading immediately
}

// Define the initial state using that type
const initialState: StarState = {
  tagList: []
}

export const StarSlice = createSlice({
  name: 'star',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addTagList: (state, action: PayloadAction<NavTagItem[]>) => {
      state.tagList = action.payload;
    },
    addNumOfStarItems: (state, action: PayloadAction<number>) => {
      state.numOfStarItems = (state.numOfStarItems || 0) + action.payload;
    },
    addNumOfUntagStarItems: (state, action: PayloadAction<number>) => {
      state.numOfUntagStarItems = (state.numOfUntagStarItems || 0) + action.payload;
    },
    setSelectedStar: (state, action: PayloadAction<StarItem>) => {
      state.selectedStar = action.payload;
    },
    setSelectedTag: (state, action: PayloadAction<FlatTagType>) => {
      state.selectedTag = action.payload;
    },
    setIsDeleteTag: (state, action: PayloadAction<boolean>) => {
      state.isDeleteTag = action.payload;
    },
    setDeletedTag: (state, action: PayloadAction<NavTagItem[] | undefined>) => {
      state.deletedTag = action.payload;
    },
    setSelectedSidebarTag: (state, action: PayloadAction<NavTagItem | undefined>) => {
      state.selectedSidebarTag = action.payload;
    },
    setEditedTag: (state, action: PayloadAction<NavTagItem>) => {
      state.editedTag = action.payload;
    },
    setContentRefresh: (state, action: PayloadAction<boolean>) => {
      state.contentRefresh = action.payload;
    }
  },
  selectors: {
    selectedTagList: (state) => state.tagList,
    selectedNumOfStarItems: (state) => state.numOfStarItems,
    selectedNumOfUntagStarItems: (state) => state.numOfUntagStarItems,
    selectedStar: (state) => state.selectedStar,
    selectedTag: (state) => state.selectedTag,
    selectedIsDeleteTag: (state) => state.isDeleteTag,
    selectedDeletedTag: (state) => state.deletedTag,
    selectedSidebarTag: (state) => state.selectedSidebarTag,
    selectedEditedTag: (state) => state.editedTag,
    selectedContentRefresh: (state) => state.contentRefresh
  }
})

export default StarSlice.reducer
export const {
  addTagList,
  addNumOfStarItems,
  addNumOfUntagStarItems,
  setSelectedStar,
  setSelectedTag,
  setIsDeleteTag,
  setDeletedTag,
  setSelectedSidebarTag,
  setEditedTag,
  setContentRefresh
} = StarSlice.actions;


const injectedStarSlice = StarSlice.injectInto(rootReducer);
export const {
  selectedNumOfUntagStarItems,
  selectedNumOfStarItems,
  selectedStar,
  selectedTag,
  selectedTagList,
  selectedIsDeleteTag,
  selectedDeletedTag,
  selectedSidebarTag,
  selectedEditedTag,
  selectedContentRefresh
} = injectedStarSlice.selectors;
