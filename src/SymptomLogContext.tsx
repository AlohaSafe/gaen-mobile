import React, { createContext, FunctionComponent, useContext } from "react"

import { SymptomLogEntry } from "./SymptomChecker/symptoms"

type SymptomLogState = {
  logEntries: SymptomLogEntry[]
  addLogEntry: (entry: SymptomLogEntry) => Promise<void>
  updateLogEntry: (entry: SymptomLogEntry) => Promise<void>
  deleteLogEntry: (entry: SymptomLogEntry) => Promise<void>
}

const initialState = {
  logEntries: [],
  addLogEntry: (_entry: SymptomLogEntry) => {
    return Promise.resolve()
  },
  updateLogEntry: (_entry: SymptomLogEntry) => {
    return Promise.resolve()
  },
  deleteLogEntry: (_entry: SymptomLogEntry) => {
    return Promise.resolve()
  },
}

const SymptomLogContext = createContext<SymptomLogState>(initialState)

export const SymptomLogProvider: FunctionComponent = ({ children }) => {
  return (
    <SymptomLogContext.Provider value={initialState}>
      {children}
    </SymptomLogContext.Provider>
  )
}

export const useSymptomLogContext = (): SymptomLogState => {
  const symptomLogContext = useContext(SymptomLogContext)
  if (symptomLogContext === undefined) {
    throw new Error("ConfigurationContext must be used with a provider")
  }
  return symptomLogContext
}
