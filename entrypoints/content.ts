export default defineContentScript({
  matches: ["*://*.google.com/*"],
  main(ctx) {
    const textAreaElements = document.querySelectorAll(
      "textarea, [contenteditable=true]"
    );

    const visibletextAreaElements = Array.from(textAreaElements).filter(
      (element) => {
        const styles = window.getComputedStyle(element);

        return (
          styles.display !== "none" &&
          styles.opacity !== "0" &&
          element.clientWidth > 0
        );
      }
    );

    visibletextAreaElements.forEach((element) => {
      element.addEventListener(
        "focus",
        () => console.log("focus is working")
      );
      element.addEventListener("input", () => console.log("input is working"));
    });
  },
});
