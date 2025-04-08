export const copyToClipboard = (
  text: string | undefined,
  onSuccess: () => void,
  onError: () => void
) => {
  if (text) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(onError);
  } else {
    onError();
  }
};
