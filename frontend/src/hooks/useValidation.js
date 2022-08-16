import { useEffect, useState } from "react";

function useValidation(data, validateFunc) {
  const [errors, setErrors] = useState({});
  const [isValidationFailedBefore, setValidationFailedBefore] = useState(false);

  useEffect(() => {
    if (isValidationFailedBefore && validateFunc) {
      setErrors(validateFunc(data));
    }
  }, [data, isValidationFailedBefore, validateFunc]);

  return [errors, isValidationFailedBefore, setValidationFailedBefore];
}

export default useValidation;
