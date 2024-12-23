import { DefaultProfile } from '@common/variables';
import { Tooltip, Avatar } from '@mui/material';
import { getServerProfileImage } from '@utils/getServerProfileImage';
import { memo } from 'react';

interface ProfileAvatarProps {
  username?: string;
  profileImage?: string;
}
const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  username,
  profileImage,
}) => {
  return username && profileImage ? (
    <Tooltip placement="bottom" title="사용자 정보">
      <Avatar
        src={getServerProfileImage(profileImage)}
        alt={username}
        sx={{
          width: 40,
          height: 40,
          boxShadow: '2px 2px 5px 0 #00000056',
        }}
      />
    </Tooltip>
  ) : (
    <DefaultProfile width={32} height={32} style={{ marginRight: 8 }} />
  );
};

export default memo(ProfileAvatar);
