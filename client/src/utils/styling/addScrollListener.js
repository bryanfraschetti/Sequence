export const addScrollListener = (scrollableElement) => {
  scrollableElement.addEventListener(
    "scroll",
    function (e) {
      if (e.target.classList.contains("scroll-active") === false) {
        e.target.classList.add("scroll-active");
      }

      // Clear our timeout throughout the scroll
      let isScrolling = null; //give default value
      window.clearTimeout(isScrolling);
      // Set a timeout to run after scrolling ends
      isScrolling = setTimeout(function () {
        // Run the callback
        e.target.classList.remove("scroll-active");
      }, 1000);
    },
    false
  );
};
