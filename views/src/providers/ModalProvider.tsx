import { useReducer } from 'react';
import { ModalContext, ModalDispatchContext } from './contexts/ModalContext';
import {
  initialValue,
  ModalActionType,
  ModalInitialValue,
  ModalReducerAction,
} from './contexts/modalTypes';
import {
  Button,
  Paper,
  Portal,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

const reducer = (state: ModalInitialValue, action: ModalReducerAction) => {
  switch (action.type) {
    case ModalActionType.Open: {
      const newState = { ...state };
      newState['open'] = true;
      if (action.title) newState['title'] = action.title;
      if (action.content) newState['content'] = action.content;
      return newState;
    }
    case ModalActionType.Close: {
      const newState = { ...state };
      newState['open'] = false;
      newState['title'] = '';
      newState['content'] = '';
      return newState;
    }
    default:
      return state;
  }
};

interface ModalProviderProps {
  children: React.ReactNode;
}
const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialValue);

  function handleClose() {
    dispatch({ type: ModalActionType.Close });
  }

  return (
    <ModalDispatchContext.Provider value={dispatch}>
      <ModalContext.Provider value={state}>
        <Portal>
          {state.open && (
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
                <Typography fontSize={24}>{state.title}</Typography>
                <Typography className="font-maru" fontSize={15}>
                  {state.content}
                </Typography>
              </Stack>
              <Button variant="outlined" color="error" onClick={handleClose}>
                닫기
              </Button>
            </Paper>
          )}
        </Portal>
        {children}
      </ModalContext.Provider>
    </ModalDispatchContext.Provider>
  );
};

export default ModalProvider;
