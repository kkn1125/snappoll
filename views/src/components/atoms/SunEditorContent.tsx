import { Box } from '@mui/material';
import { memo } from 'react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

interface SunEditorContentProps {
  content?: string;
}
const SunEditorContent: React.FC<SunEditorContentProps> = ({ content }) => {
  return (
    <Box
      className="sun-editor-editable"
      sx={{
        fontSize: '1em',
      }}
    >
      <Box
        className="se-wrapper-inner se-wrapper-wysiwyg sun-editor-editable"
        fontWeight={500}
        dangerouslySetInnerHTML={{ __html: content || '' }}
      />
    </Box>
  );
};

export default memo(SunEditorContent);
