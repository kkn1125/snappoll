import { deletePlan } from '@apis/panel/deletePlan';
import { getPlansView } from '@apis/panel/getPlansView';
import { Message } from '@common/messages';
import DataListTable from '@components/moleculars/DataListTable';
import useModal from '@hooks/useModal';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Button, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isNil } from '@utils/isNil';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

interface PanelPlanProps {}
const PanelPlan: React.FC<PanelPlanProps> = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openInteractiveModal } = useModal();
  const [searchParams] = useSearchParams({ page: '1' });
  const page = +(searchParams.get('page') || 1);
  const { data, refetch } = useQuery<
    SnapResponseType<{
      plans: Plan[];
      columns: string[];
      count: number;
    }>
  >({
    queryKey: ['panelPlan', page],
    queryFn: () => getPlansView(page),
  });
  const deletePlanMutation = useMutation({
    mutationKey: ['deletePlan'],
    mutationFn: deletePlan,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['panelPlan'],
      });
      refetch();
    },
  });
  const plans = data?.data.plans;
  const count = data?.data.count;
  const columnList = data?.data.columns;
  const columns = useMemo(() => {
    if (!columnList) return [] as GridColDef[];
    return columnList.map(
      (column) =>
        ({
          field: column,
          headerName: column,
          flex: 1,
          type: (() => {
            switch (column) {
              case 'id':
              case 'name':
              case 'description':
              case 'planType':
                return 'string';
              case 'price':
              case 'discount':
                return 'number';
              case 'createdAt':
              case 'updatedAt':
                return 'dateTime';
              default:
                return 'string';
            }
          })(),
          valueFormatter: (params) => {
            if (column.match(/^price/)) {
              return (params + 0).toLocaleString('ko-KR', {
                currency: 'KRW',
                style: 'currency',
              });
            }
            if (column.match(/^discount/)) {
              return ((params + 0) * 0.01).toLocaleString('ko-KR', {
                currency: 'KRW',
                style: 'percent',
              });
            }
            if (column.match(/^(created|updated|sendAt)/gi)) {
              if (isNil(params)) return '-';
              return dayjs(params).format('YYYY. MM. DD. HH:mm');
            }
            if (isNil(params)) return '-';
            return params;
          },
        }) as GridColDef,
    );
  }, [columnList]);

  function reloadPlans() {
    queryClient.invalidateQueries({
      queryKey: ['panelPlan'],
    });
    refetch();
  }

  function handleDeletePlan(id: string) {
    openInteractiveModal({
      content: Message.Single.Remove,
      callback() {
        deletePlanMutation.mutate(id);
      },
    });
  }

  function handleEdit(id: string) {
    const planData = plans?.find((plan) => plan.id === id);
    if (planData) {
      navigate(`/panel/plan`, {
        state: { plan: planData },
      });
    }
  }

  return (
    <Stack component={Paper} elevation={5} p={3} gap={2}>
      {/* Button Navigations */}
      <Stack direction="row" gap={1}>
        {/* <Button component={Link} to={`/panel/plan`} state={{ mode: 'admin' }}>
          메일 작성
        </Button> */}
      </Stack>
      <DataListTable
        columns={columns || []}
        rows={plans || []}
        getActions={({ id }) => {
          return [
            <Tooltip title="수정">
              <IconButton onClick={() => handleEdit(id as string)}>
                <ModeEditIcon />
              </IconButton>
            </Tooltip>,
            <Tooltip title="제거">
              <IconButton onClick={() => handleDeletePlan(id as string)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>,
          ];
        }}
      />
    </Stack>
  );
};

export default PanelPlan;
