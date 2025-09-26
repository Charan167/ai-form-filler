export default defineContentScript({
  matches: ["https://*/*"],
  main(ctx) {
    console.log("hello", getInputs());
    // const textAreaElements = document.querySelectorAll(
    //   "textarea, [contenteditable=true]",
    // );
    //
    // const visibletextAreaElements = Array.from(textAreaElements).filter(
    //   (element) => {
    //     const styles = window.getComputedStyle(element);
    //
    //     return (
    //       styles.display !== "none" &&
    //       styles.opacity !== "0" &&
    //       element.clientWidth > 0
    //     );
    //   },
    // );
    //
    // visibletextAreaElements.forEach((element) => {
    //   element.addEventListener("focus", () => console.log("focus is working"));
    //   element.addEventListener("input", () => console.log("input is working"));
    // });
  },
});

function getInputs() {
  let formFields: NodeListOf<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  > = [];
  const formElements = document.querySelectorAll("input, select, textarea");

  formElements.forEach((element, index) => {
    if ("type" in element) {
      if (
        element.type === "hidden" ||
        element.type === "button" ||
        element.type === "submit" ||
        element.type === "reset"
      ) {
        return;
      }
    }
    if ("style" in element) {
      if (element.style.display === "none") {
        return;
      }
    }

    if ("offsetParent" in element) {
      if (element.offsetParent === null) {
        return;
      }
    }

    const fieldData = {
      id: crypto.randomUUID(),
      element: {
        tagName: element.tagName,
        type: element.type || null,
        name: element.name || null,
        id: element.id || null,
        className: element.className || null,
      },
    };

    formFields.push(fieldData);
  });

  return formFields;
}
