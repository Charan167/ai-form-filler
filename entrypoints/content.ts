import { getInputs } from "./GetInputs/main";

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

// function getInputs() {
//   let formFields: Record<string, any>[] = [];
//   const formElements = document.querySelectorAll<
//     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//   >("input, select, textarea");

//   formElements.forEach((element, index) => {
//     if ("type" in element) {
//       if (
//         element.type === "hidden" ||
//         element.type === "button" ||
//         element.type === "submit" ||
//         element.type === "reset"
//       ) {
//         return;
//       }
//     }
//     if ("style" in element) {
//       if (element.style.display === "none") {
//         return;
//       }
//     }

//     if ("offsetParent" in element) {
//       if (element.offsetParent === null) {
//         return;
//       }
//     }

//     // const fieldData = {
//     //   id: crypto.randomUUID(),
//     //   element: {
//     //     tagName: element.tagName,
//     //     type: element.type || null,
//     //     name: element.name || null,
//     //     id: element.id || null,
//     //     className: element.className || null,
//     //   },
//     // };

//     const fieldData = createFormFieldData(element);
//     if (!fieldData) return;

//     formFields.push(fieldData);
//   });

//   return formFields;
// }

// function createFormFieldData(
//   element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
// ) {
//   const tagName = element.tagName.toLowerCase();
//   const type = (element.getAttribute("type") || tagName).toLowerCase();

//   if (["hidden", "submit", "button", "reset", "file"].includes(type))
//     return null;
//   if (element.disabled || (element as HTMLInputElement).readOnly) return null;

//   let value = "";
//   if (type === "checkbox" || type === "radio") {
//     value = (element as HTMLInputElement).checked ? "true" : "false";
//   } else {
//     value = element.value || "";
//   }

//   return {
//     id: crypto.randomUUID(),
//     element: {
//       id: element.id || "",
//       name: element.name || "",
//       tagName: element.tagName,
//       type,
//       label: getLabelForElement(element),
//       placeholder:
//         (element as HTMLInputElement | HTMLTextAreaElement).placeholder || "",
//       required:
//         (element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)
//           .required || false,
//       value,
//     },
//   };
// }

// function getLabelForElement(
//   element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
// ): string {
//   if (element.id) {
//     const label = document.querySelector(`label[for="${element.id}"]`);
//     if (label) return label.textContent?.trim() || "";
//   }

//   const parentLabel = element.closest("label");
//   if (parentLabel) {
//     return (
//       parentLabel.textContent?.replace(element.value || "", "").trim() || ""
//     );
//   }

//   const ariaLabel = element.getAttribute("aria-label");
//   if (ariaLabel) return ariaLabel.trim();

//   const ariaLabelledBy = element.getAttribute("aria-labelledby");
//   if (ariaLabelledBy) {
//     const labelElement = document.getElementById(ariaLabelledBy);
//     if (labelElement) return labelElement.textContent?.trim() || "";
//   }

//   const prev = element.previousElementSibling;
//   if (
//     prev &&
//     !["input", "select", "textarea", "button", "label"].includes(
//       prev.tagName.toLowerCase()
//     )
//   ) {
//     return prev.textContent?.trim() || "";
//   }

//   return "";
// }
