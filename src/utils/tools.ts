export const gravatarUrl = (address: string) => {
  const addressHash = address.slice(2) + address.slice(2);

  return `https://www.gravatar.com/avatar/${addressHash}?d=identicon`;
};
