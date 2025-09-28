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
  const formElements = document.querySelectorAll(
    "input, select, textarea",
  ) as NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

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
      label: getFieldLabel(element),
    };

    formFields.push(fieldData);
  });

  return formFields;
}

function getFieldLabel(
  element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
) {
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent.trim();
  }

  const parentLabel = element.closest("label");
  if (parentLabel) {
    return parentLabel.textContent.replace(element.value || "", "").trim();
  }

  let prevSibling = element.previousElementSibling;
  while (prevSibling) {
    if (prevSibling.tagName === "LABEL") {
      return prevSibling.textContent.trim();
    }
    if (prevSibling.textContent && prevSibling.textContent.trim()) {
      break;
    }
    prevSibling = prevSibling.previousElementSibling;
  }

  const nearbyText = findNearbyText(element);
  if (nearbyText) return nearbyText;

  return (
    element.name ||
    ("placeholder" in element && element.placeholder) ||
    element.getAttribute("aria-label") ||
    element.id ||
    "Unknown Field"
  );
}

function findNearbyText(
  element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
) {
  const parent = element.parentElement;
  if (!parent) return null;

  const parentText = parent.textContent.replace(element.value || "", "").trim();
  if (parentText && parentText.length < 100) {
    return parentText;
  }

  const siblings = Array.from(parent.children);
  for (let sibling of siblings) {
    if (
      sibling !== element &&
      sibling.textContent.trim() &&
      sibling.textContent.trim().length < 50
    ) {
      return sibling.textContent.trim();
    }
  }

  return null;
}
