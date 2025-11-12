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
  const [initializationInfo, setInitializationInfo] = useState<IMessageContext['InitializationInfo']>();
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

  //This function is called when an employee card is dropped into a new cell in the 9-grid
  const onDrop = (employee_id: number, year: number, performance: number, potential: number) => {
    //We will make a PATCH request to update the employee's performance and potential
    //We don't need configuration to find our endpoint, we can build it from the initialization info
    const url = `${initializationInfo?.ApplicationUrl}/employee_perfomance_view.stage_2(employee_id=${employee_id},year=${year})`;

    //Add the PATCH request to update performance and potential
    const patchData = {
      performance: performance,
      potential: potential
    };
    fetch(url, {
      method: 'PATCH',
      headers: {  
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(patchData)
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      //After updating, we can refresh the data by starting a process flow to refresh
      parentStartProcessFlow('employee_performance_refresh', {});

    }).catch(error => {
      console.error('Error updating employee performance:', error);
    });
  }

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
      <NineGrid employees={dataContext.DataSet as IEmployeePerformance[]} currentEmployeeId={dataRowContext.DataRow?.employee_id} onDrop={onDrop} />
    </>
  )
}