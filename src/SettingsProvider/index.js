// @flow

import React, {createContext, useContext} from "react"

const defaultSettings = {
  showCrosshairs: false,
  showHighlightBox: true,
  wasdMode: true,
}

export const SettingsContext = createContext({...defaultSettings})
export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = ({children}) => {
  return (
    <SettingsContext.Provider value={{...defaultSettings}}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider
