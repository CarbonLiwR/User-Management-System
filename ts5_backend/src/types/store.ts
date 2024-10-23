import { UserState } from "./user"
import { AppState } from "./menu"
import { LayoutMode } from "./layout"
import { StateTheme } from "./theme"


export interface componentsVisible {
  footer: boolean
  topMenu: boolean
}

export default interface State {
  menu: AppState
  user: UserState
  layout: LayoutMode[]
  componentsVisible: componentsVisible
  theme: StateTheme
}