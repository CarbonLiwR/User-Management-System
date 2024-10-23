const SINGLE_COLUMN = "SINGLECOLUMN";
const TWO_COLUMN = "TWO_COLUMN";
const TWO_FLANKS = "TWO_FLANKS";
const FULL_SCREEN = "FULLSCREEN"
export { SINGLE_COLUMN, TWO_COLUMN, TWO_FLANKS, FULL_SCREEN };


export type LayoutMode = "TWO_COLUMN" | "SINGLECOLUMN" | "TWO_FLANKS" | "FULLSCREEN" | null
export type LayoutModeType = 'push' | 'pop'
export interface LayoutAction {
    type: LayoutModeType,
    mode: LayoutMode
}

export type LayoutModes = {
    img: string
    mode: LayoutMode
    alt: string
}[]