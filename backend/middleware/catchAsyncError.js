const catchAsyncError = (callback) => {
  return (req, res, errorCallBack) => {
    return Promise.resolve(callback(req, res, errorCallBack)).catch(
      errorCallBack
    );
  };
};

module.exports = catchAsyncError;
