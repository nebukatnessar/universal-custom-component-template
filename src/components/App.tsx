import React from "react";
import { useState } from 'react';
import { useMessageHandler } from '../effects/useMessageHandler';


const setThemeClasses = (theme: string) => {
  document.body.classList.remove('light-theme', 'dark-theme');
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.add('light-theme');
  }
};

export interface IInitializationInfo {
  Application: number;
  ApplicationAlias: string;
  ApplicationUrl: string;
  MetaURL: string;
  Entity: string;
  IndiciumRootUrl: string;
}


export interface IDataContext {
  EntityQueryPath: string;
  DataSetLocation: string;
  DataSet: Record<string, any>[];
}

export interface IDataRowContext {
  DataRow: Record<string, any>;
  DataRowLocation: string;
}

export interface IMessageContext extends IDataContext, IDataRowContext {
  InitializationInfo: IInitializationInfo;
  State: string;
  Theme: string;
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
    setThemeClasses,
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
      <p>Hi Universal is in {universalState} state</p>
      <p>Current Theme: {theme}</p>
      <p>
        Initialization Info: {initializationInfo.ApplicationAlias} - {initializationInfo.Entity}
      </p>
      <p>Data Context: {JSON.stringify(dataContext)}</p>
      <p>Data Row Context: {JSON.stringify(dataRowContext)}</p>

      <p>Dataset Location: {dataContext?.DataSetLocation}</p>
      <p>You can loop the DataSet array:</p>
      <ul>
        {dataContext?.DataSet.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </>
  )
}