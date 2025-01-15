import { SnapPoll } from '@models/SnapPoll';
import { SnapVote } from '@models/SnapVote';
import {
  Button,
  ButtonGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import { ChangeEvent, FormEvent, SyntheticEvent, useState } from 'react';

interface SearchbarProps {
  columnList: (keyof (SnapPoll | SnapVote))[];
  handleFilter: (key: keyof (SnapPoll | SnapVote), value: any) => void;
  resetList: () => void;
}
const Searchbar: React.FC<SearchbarProps> = ({
  columnList,
  handleFilter,
  resetList,
}) => {
  const [keyword, setKeyword] = useState<keyof (SnapPoll | SnapVote)>(
    columnList[0],
  );
  const [value, setValue] = useState('');

  function handleChangeKeyword(e: SelectChangeEvent) {
    setKeyword(e.target.value as keyof (SnapPoll | SnapVote));
  }

  function handleChangeValue(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleFilter(keyword, value);
    return false;
  }

  return (
    <Stack
      flex={1}
      direction="row"
      gap={1}
      alignItems="stretch"
      component="form"
      onSubmit={handleSubmit}
    >
      <ButtonGroup sx={{ flex: 1 }}>
        <Select
          size="small"
          value={keyword}
          onChange={handleChangeKeyword}
          sx={{
            fontWeight: 700,
            backgroundColor: '#eee',
            ['& .MuiOutlinedInput-notchedOutline']: {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              // borderRightWidth: 0.5,
            },
          }}
        >
          {columnList.map((column) => (
            <MenuItem key={column} value={column}>
              {(() => {
                switch (column) {
                  case 'id':
                    return '아이디';
                  case 'title':
                    return '제목';
                  case 'description':
                    return '설명';
                  case 'userId':
                    return '유저아이디';
                  case 'expiresAt':
                    return '만료기간';
                  case 'createdAt':
                    return '생성일자';
                  case 'updatedAt':
                    return '수정일자';
                  default:
                    return column;
                }
              })()}
            </MenuItem>
          ))}
        </Select>
        <TextField
          size="small"
          fullWidth
          onChange={handleChangeValue}
          sx={{
            ml: (theme) => theme.typography.pxToRem(-0.5),
            ['& .MuiInputBase-root']: {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            },
            ['& .MuiOutlinedInput-notchedOutline']: {
              // borderLeftWidth: 0.5,
            },
          }}
        />
      </ButtonGroup>
      <Button variant="contained" type="submit">
        검색
      </Button>
      <Button variant="contained" onClick={resetList}>
        초기화
      </Button>
    </Stack>
  );
};

export default Searchbar;
