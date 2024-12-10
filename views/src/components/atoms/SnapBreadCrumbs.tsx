import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, Chip, Container } from '@mui/material';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SnapBreadCrumbsProps {}
const SnapBreadCrumbs: React.FC<SnapBreadCrumbsProps> = () => {
  const locate = useLocation();
  const breadcrumbs = useMemo(() => {
    const splitted = locate.pathname.split(/\//g);
    const removeDuplicate = [...new Set(splitted)].filter(
      (path) => path !== 'edit',
    );
    const getPath = (i: number) => removeDuplicate.slice(0, i + 1).join('/');
    return removeDuplicate.map((path, i) => (
      <Chip
        key={path}
        {...(i < removeDuplicate.length - 1 && {
          component: Link,
          to: getPath(i) || '/',
        })}
        size="small"
        variant={i === removeDuplicate.length - 1 ? 'filled' : 'outlined'}
        label={(removeDuplicate[i] || 'home').toUpperCase()}
        sx={{
          cursor: i < removeDuplicate.length - 1 ? 'pointer' : 'auto',
          ['&:hover']: {
            backgroundColor: '#eee',
          },
        }}
      />
    ));
  }, [locate.pathname]);

  if (breadcrumbs.length === 1) return <></>;

  return (
    <Container sx={{ py: 2 }}>
      <Breadcrumbs
        key={locate.pathname}
        maxItems={4}
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Container>
  );
};

export default SnapBreadCrumbs;
