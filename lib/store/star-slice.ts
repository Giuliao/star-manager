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
  },
  selectors: {
    selectedNumOfStarItems: (state) => state.numOfStarItems,
    selectedNumOfUntagStarItems: (state) => state.numOfUntagStarItems,
  }
})

export default StarSlice.reducer
export const {
  addTagList,
  addNumOfStarItems,
  addNumOfUntagStarItems,
  setSelectedStar
} = StarSlice.actions;


const injectedStarSlice = StarSlice.injectInto(rootReducer);
export const {
  selectedNumOfUntagStarItems,
  selectedNumOfStarItems
} = injectedStarSlice.selectors;
