import React from "react";
import { useState } from 'react';
import { IDataContext, IDataRowContext, IMessageContext, useMessageHandler } from '../hooks/useMessageHandler';
import { IEmployeePerformance, NineGrid } from "./NineGrid";

//Start a process flow in Universal with the provided parameters.
export const parentStartProcessFlow = (processFlowId: string, params: any) => {
  window.parent.postMessage({ type: 'startProcessFlow', processFlowId, dataParams: params }, '*');
}


export default function App() {
  const [universalState, setUniversalState] = useState<string>('regular');
  const [componentInitialized, setComponentInitialized] = useState(false);
  const [initializationInfo, setInitializationInfo] = useState<any>();
  const [messageContext, setMessageContext] = useState<IMessageContext>();
  const [dataContext, setDataContext] = useState<IDataContext>();
  const [dataRowContext, setDataRowContext] = useState<IDataRowContext>();
  const [theme, setTheme] = useState<string>('light');

  useMessageHandler({
    setUniversalState,
    setComponentInitialized,
    setInitializationInfo,
    setMessageContext,
    setDataContext,
    setDataRowContext,
    setTheme,
    messageContext,
  });

  if (!componentInitialized || !dataContext || !dataRowContext || !initializationInfo) {
    return <div>Waiting for message...</div>;
  }

  return (
    <>
      {/* Overlay to lock interaction if an universal is not in regular state */}
      {universalState !== 'regular' && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.5)",
            cursor: "not-allowed"
          }}
          tabIndex={-1}
          aria-hidden="true"
        />
      )}
      <NineGrid employees={dataContext.DataSet as IEmployeePerformance[]} />
    </>
  )
}