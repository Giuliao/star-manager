import { combineSlices } from '@reduxjs/toolkit'

export interface LazyLoadedSlices { }

export const rootReducer =
  combineSlices({}).withLazyLoadedSlices<LazyLoadedSlices>();
