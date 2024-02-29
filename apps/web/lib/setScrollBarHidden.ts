export const setScrollBarHidden = () => {
  if (document.body.style.overflow !== "hidden") {
    document.body.style.overflow = "hidden visible";
  } else {
    document.body.style.overflow = "hidden visible";
  }
};
