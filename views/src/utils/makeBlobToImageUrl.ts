export const makeBlobToImageUrl = (tokenProfile: Profile) => {
  const length = Object.keys(tokenProfile.image).length;
  const image = { ...tokenProfile.image, length };
  const buffer = Array.from<number>(image);
  const blob = new Blob([new Uint8Array(buffer)], {
    type: 'image/jpeg',
  });
  const url = URL.createObjectURL(blob);
  const revokeUrl = () => URL.revokeObjectURL(url);
  return { url, revokeUrl };
};
