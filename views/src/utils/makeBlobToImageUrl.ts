export const makeBlobToImageUrl = (buffer?: number[]) => {
  if (!buffer) return '';
  const blob = new Blob([new Uint8Array(buffer)], {
    type: 'image/jpeg',
  });
  const url = URL.createObjectURL(blob);
  return url;
};
