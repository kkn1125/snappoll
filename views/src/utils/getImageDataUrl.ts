export const getImageDataUrl = (
  buffer: File | Uint8Array,
  fileType: string,
) => {
  const blob = new Blob([buffer], {
    type: fileType,
  });
  const url = URL.createObjectURL(blob);
  const revokeUrl = () => URL.revokeObjectURL(url);
  return { url, revokeUrl };
};
