import { updatePlan } from '@apis/panel/updatePlan';
import useLogger from '@hooks/useLogger';
import useModal from '@hooks/useModal';
import {
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface EditPlanPageProps {}
const EditPlanPage: React.FC<EditPlanPageProps> = () => {
  const { openModal } = useModal();
  const { debug } = useLogger('EditPlanPage');
  const { state } = useLocation();
  const planData = state.plan as Plan;
  const [data, setData] = useState<
    Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>
  >({
    name: 'test',
    description: '',
    price: 0,
    discount: 0,
    planType: 'Free',
  });

  const updatePlanMutation = useMutation({
    mutationKey: ['updatePlan'],
    mutationFn: updatePlan,
    onSuccess(data, variables, context) {
      debug(data);
      openModal({
        info: {
          title: '안내',
          content: '플랜 정보를 수정하었습니다.',
        },
        closeCallback: () => {
          window.history.back();
        },
      });
    },
  });

  useEffect(() => {
    if (planData) {
      setData(planData);
    }
  }, [planData]);

  return (
    <Stack
      direction="column"
      flex={1}
      component="form"
      gap={2}
      p={2}
      onSubmit={(e) => {
        e.preventDefault();
        debug(data);
        updatePlanMutation.mutate({ id: planData.id, data });
      }}
    >
      <Typography variant="h4">플랜 수정</Typography>
      <Stack spacing={2}>
        <TextField
          name="name"
          label="name"
          variant="outlined"
          value={data.name ?? ''}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <TextField
          label="description"
          variant="outlined"
          multiline
          rows={4}
          name="description"
          value={data.description ?? ''}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
      </Stack>
      <Stack spacing={2}>
        <Select
          name="planType"
          value={data.planType}
          onChange={(e) =>
            setData({ ...data, planType: e.target.value as Plan['planType'] })
          }
        >
          <MenuItem value="Free">Free</MenuItem>
          <MenuItem value="Basic">Basic</MenuItem>
          <MenuItem value="Pro">Pro</MenuItem>
          <MenuItem value="Premium">Premium</MenuItem>
        </Select>
      </Stack>
      <Stack spacing={2}>
        <TextField
          name="price"
          label="price"
          variant="outlined"
          value={data.price ?? ''}
          onChange={(e) => setData({ ...data, price: +e.target.value })}
          type="number"
          slotProps={{
            input: {
              slotProps: {
                input: {
                  min: 0,
                  step: 100,
                },
              },
            },
          }}
        />
        <TextField
          name="discount"
          label="discount"
          variant="outlined"
          value={data.discount ?? ''}
          onChange={(e) => setData({ ...data, discount: +e.target.value })}
          type="number"
          slotProps={{
            input: {
              slotProps: {
                input: {
                  min: 0,
                  max: 100,
                  step: 5,
                },
              },
            },
          }}
        />
      </Stack>
      <Stack direction="row" justifyContent="flex-end">
        <Button type="submit" variant="contained" color="primary">
          수정
        </Button>
      </Stack>
    </Stack>
  );
};

export default EditPlanPage;
