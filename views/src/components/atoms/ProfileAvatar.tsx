import { DefaultProfile } from '@common/variables';
import { Avatar, Tooltip } from '@mui/material';
import { getServerProfileImage } from '@utils/getServerProfileImage';
import { memo } from 'react';

interface ProfileAvatarProps {
  size?: number;
  username?: string;
  profileImage?: string;
}
const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  size = 40,
  username,
  profileImage,
}) => {
  return username && profileImage ? (
    <Tooltip placement="bottom" title={`${username}님 정보`}>
      <Avatar
        src={getServerProfileImage(profileImage)}
        alt={username}
        sx={{
          width: size,
          height: size,
          boxShadow: '2px 2px 5px 0 #00000056',
        }}
      />
    </Tooltip>
  ) : (
    <DefaultProfile width={32} height={32} style={{ marginRight: 8 }} />
  );
};

export default memo(ProfileAvatar);
