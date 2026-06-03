export const validateRequest = (validation) => {
  return (req, res, next) => {
    validation(req, res, next);
  };
};
