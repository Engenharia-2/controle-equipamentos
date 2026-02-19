export const useButtonLogic = (onClick?: () => void) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return {
    handleClick,
  };
};
