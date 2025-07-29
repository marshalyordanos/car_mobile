const removeHTMLTags = (inputString) => {
  return inputString.replace(/<\/?[^>]+(>|$)/g, "");
};

export { removeHTMLTags };
