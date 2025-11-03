import { useEffect } from 'react';

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

interface UseMessageHandlerProps {
  setUniversalState: (state: string) => void;
  setComponentInitialized: (initialized: boolean) => void;
  setInitializationInfo: (info: IInitializationInfo) => void;
  setMessageContext: (context: IMessageContext) => void;
  setDataContext: (context: IDataContext) => void;
  setDataRowContext: (context: IDataRowContext) => void;
  setTheme: (theme: string) => void;
  messageContext?: IMessageContext;
}

export function useMessageHandler({
  setUniversalState,
  setComponentInitialized,
  setInitializationInfo,
  setMessageContext,
  setDataContext,
  setDataRowContext,
  setTheme,
  messageContext,
}: UseMessageHandlerProps) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Received message:', event.data);

      if (!event.data) return;
      const messageContext: IMessageContext = event.data;
      setMessageContext(messageContext);

      if (event.data?.EventType === 'initContext') {
        setDataContext({
          EntityQueryPath: messageContext.EntityQueryPath,
          DataSet: messageContext.DataSet,
          DataSetLocation: messageContext.DataSetLocation,
        });
        setDataRowContext({
          DataRow: messageContext.DataRow,
          DataRowLocation: messageContext.DataRowLocation,
        });
        setInitializationInfo(messageContext.InitializationInfo);
        setComponentInitialized(true);
        setThemeClasses(event.data.Theme);
        setTheme(event.data.Theme);
      }

      if (event.data?.EventType === 'updateTheme') {
        setTheme(event.data.Theme);
        setThemeClasses(event.data.Theme);
      }

      if (event.data?.EventType === 'updateDataSet') {
        setDataContext({
          EntityQueryPath: messageContext.EntityQueryPath,
          DataSet: messageContext.DataSet,
          DataSetLocation: messageContext.DataSetLocation,
        });
        setDataContext(messageContext);
      }

      if (event.data?.EventType === 'updateDataRow') {
        setDataRowContext({
          DataRow: messageContext.DataRow,
          DataRowLocation: messageContext.DataRowLocation,
        });
      }

      if (event.data?.EventType === 'updateState') {
        setUniversalState(event.data.State);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [messageContext]);
}
