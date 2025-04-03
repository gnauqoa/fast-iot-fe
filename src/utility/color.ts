export const stringToHexColor = (str: string): string => {
  const hash = hashCode(str);
  return `#${intToRGB(hash)}`;
};

export const hashCode = (str: string): number => {
  // java String#hashCode
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return hash;
};

export const intToRGB = (i: number): string => {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
};
