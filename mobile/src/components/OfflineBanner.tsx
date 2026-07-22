import { useEffect, useRef, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Snackbar } from 'react-native-paper';
import { useAppTheme } from '../contexts/ThemeContext';

export function OfflineBanner() {
  const { colors } = useAppTheme();
  const [isOffline, setIsOffline] = useState(false);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const isFirstEvent = useRef(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = state.isConnected === false || state.isInternetReachable === false;

      if (isFirstEvent.current) {
        isFirstEvent.current = false;
        setIsOffline(offline);
        if (offline) {
          setMessage('Sem conexão com a internet');
          setVisible(true);
        }
        return;
      }

      if (offline !== isOffline) {
        setIsOffline(offline);
        setMessage(offline ? 'Sem conexão com a internet' : 'Conexão restaurada');
        setVisible(true);
      }
    });

    return () => unsubscribe();
  }, [isOffline]);

  return (
    <Snackbar
      visible={visible}
      onDismiss={() => setVisible(false)}
      duration={isOffline ? 99999999 : 2500}
      style={{ backgroundColor: isOffline ? colors.error : colors.success }}
    >
      {message}
    </Snackbar>
  );
}
