const generetedOtp = () => {
  const plusNumber = 100000;
  const multiplication = 900000;
  return Math.floor(Math.random() * multiplication) + plusNumber; ///100000 to 900000
};

export default generetedOtp;
