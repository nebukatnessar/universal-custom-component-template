import { useEffect } from 'react';
import { IMessageContext, IDataContext, IDataRowContext, IInitializationInfo } from '../components/App';

interface UseMessageHandlerProps {
  setUniversalState: (state: string) => void;
  setComponentInitialized: (initialized: boolean) => void;
  setInitializationInfo: (info: IInitializationInfo) => void;
  setMessageContext: (context: IMessageContext) => void;
  setDataContext: (context: IDataContext) => void;
  setDataRowContext: (context: IDataRowContext) => void;
  setTheme: (theme: string) => void;
  setThemeClasses: (theme: string) => void;
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
  setThemeClasses,
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
