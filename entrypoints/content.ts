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
  let formFields: Record<
    string,
    Record<string, string | number | null> | string | number | null
  >[] = [];
  const formElements = document.querySelectorAll("input, select, textarea");

  formElements.forEach((element, index) => {
    let elementType: string | unknown = "";
    let elementName: string | unknown = "";
    if ("type" in element) {
      elementType = element.type;
      if (
        element.type === "hidden" ||
        element.type === "button" ||
        element.type === "submit" ||
        element.type === "reset"
      ) {
        return;
      }
    }
    if ("name" in element) {
      elementName = element.name;
    }
    if ("style" in element) {
      if ((element as HTMLElement).style.display === "none") {
        return;
      }
    }

    if ("offsetParent" in element) {
      if (element.offsetParent === null) {
        return;
      }
    }
    if (!element.id) {
      element.id = crypto.randomUUID();
    }

    const fieldData = {
      id: crypto.randomUUID(),
      element: {
        tagName: element.tagName,
        type: (elementType as string) || null,
        name: (elementName as string) || null,
        id: element.id || null,
        className: element.className || null,
      },
    };

    formFields.push(fieldData);
  });

  return formFields;
}
