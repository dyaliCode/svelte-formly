const isRequired = (field) => {
  if (field.validation) {
    if (field.validation.length > 0) {
      return true;
    }
  }
  return false;
};

const isArray = (arr) => {
  return Array.isArray(arr);
}

export { isRequired, isArray };
