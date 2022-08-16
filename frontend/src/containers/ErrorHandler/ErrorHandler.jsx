import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../../components/Toast/Toast";
import { errorMessages } from "../../constants/messages";
import { resetError } from "../../redux/actions/errorActions";

function ErrorHandler({ children }) {
  const apiError = useSelector((state) => state.error.error);
  const dispatch = useDispatch();

  const generateErrorMessage = (errorCode) => {
    console.log(errorCode);
    switch (errorCode) {
      case "TABLE_00003":
        return errorMessages.TABLE_NOT_CHECKED_IN;

      case "SERVER_ERROR":
        return errorMessages.INTERNAL_SERVER_ERROR;

      default:
        return null;
    }
  };

  return (
    <>
      {apiError?.code && (
        <Toast
          message={generateErrorMessage(apiError.code)}
          variant='error'
          handleClose={() => dispatch(resetError())}
        />
      )}
      {children}
    </>
  );
}

export default ErrorHandler;
