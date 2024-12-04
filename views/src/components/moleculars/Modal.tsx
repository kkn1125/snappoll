import {
  Box,
  Button,
  keyframes,
  Paper,
  Portal,
  Stack,
  Typography,
} from '@mui/material';
import {
  ModalContext,
  ModalDispatchContext,
} from '@providers/contexts/ModalContext';
import { ModalActionType } from '@providers/contexts/modalTypes';
import { MouseEvent, useCallback, useContext, useState } from 'react';

interface ModalProps {}
const Modal: React.FC<ModalProps> = () => {
  const [highlight, setHighlight] = useState(false);
  const modalState = useContext(ModalContext);
  const modalDispatch = useContext(ModalDispatchContext);
  const [timeoutKey, setTimeoutKey] = useState<NodeJS.Timeout | number>(0);
  const shake = keyframes`
    0% { transform: translate(calc(-50% + 1px), 1px) rotate(0deg); }
    10% { transform: translate(calc(-50% + -1px), -2px) rotate(-1deg); }
    20% { transform: translate(calc(-50% + -3px), 0px) rotate(1deg); }
    30% { transform: translate(calc(-50% + 3px), 2px) rotate(0deg); }
    40% { transform: translate(calc(-50% + 1px), -1px) rotate(1deg); }
    50% { transform: translate(calc(-50% + -1px), 2px) rotate(-1deg); }
    60% { transform: translate(calc(-50% + -3px), 1px) rotate(0deg); }
    70% { transform: translate(calc(-50% + 3px), 1px) rotate(-1deg); }
    80% { transform: translate(calc(-50% + -1px), -1px) rotate(1deg); }
    90% { transform: translate(calc(-50% + 1px), 2px) rotate(0deg); }
    100% { transform: translate(calc(-50% + 0px), -0px) rotate(-1deg); }
  `;

  function handleConfirm(callback: () => void | Promise<void>) {
    modalDispatch({ type: ModalActionType.Close });
    callback();
  }

  function handleClose() {
    modalDispatch({ type: ModalActionType.Close });
  }

  const handleDownHighlight = useCallback((e: MouseEvent<HTMLElement>) => {
    clearTimeout(timeoutKey);
    setTimeoutKey(0);
    setHighlight(true);
    const key = setTimeout(() => {
      setHighlight(false);
    }, 300);
    setTimeoutKey(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Portal>
      {modalState.open && (
        <>
          <Box
            position="absolute"
            onMouseDown={handleDownHighlight}
            sx={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1100,
              background: '#00000056',
            }}
          />
          <Paper
            id="modal-window"
            component={Stack}
            p={3}
            minWidth={{ xs: '80vw', md: '20vw' }}
            maxWidth={{ xs: '90vw', md: '30vw' }}
            gap={3}
            sx={{
              position: 'absolute',
              top: '20vh',
              left: '50%',
              transform: 'translate(-50%, 0%)',
              zIndex: 1150,
              ...(highlight && {
                animation: `${shake} 200ms ease-in`,
              }),
            }}
          >
            <Stack gap={1}>
              <Typography fontSize={24}>{modalState.title}</Typography>
              {modalState.content.map((ctt, i) => (
                <Typography key={ctt + i} className="font-maru" fontSize={15}>
                  {ctt}
                </Typography>
              ))}
            </Stack>
            <Stack direction="row" justifyContent="space-between" gap={2}>
              {modalState.interactive && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleConfirm(modalState.callback)}
                  fullWidth
                >
                  확인
                </Button>
              )}
              <Button
                variant="contained"
                color="inherit"
                onClick={handleClose}
                fullWidth
              >
                닫기
              </Button>
            </Stack>
          </Paper>
        </>
      )}
    </Portal>
  );
};

export default Modal;
