import { Button, Paper, Portal, Stack, Typography } from '@mui/material';
import {
  ModalContext,
  ModalDispatchContext,
} from '@providers/contexts/ModalContext';
import { ModalActionType } from '@providers/contexts/modalTypes';
import { useContext } from 'react';

interface ModalProps {}
const Modal: React.FC<ModalProps> = () => {
  const modalState = useContext(ModalContext);
  const modalDispatch = useContext(ModalDispatchContext);

  function handleConfirm(callback: () => void | Promise<void>) {
    modalDispatch({ type: ModalActionType.Close });
    callback();
  }

  function handleClose() {
    modalDispatch({ type: ModalActionType.Close });
  }

  return (
    <Portal>
      {modalState.open && (
        <Paper
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
            zIndex: 100,
          }}
        >
          <Stack gap={1}>
            <Typography fontSize={24}>{modalState.title}</Typography>
            <Typography className="font-maru" fontSize={15}>
              {modalState.content}
            </Typography>
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
      )}
    </Portal>
  );
};

export default Modal;
