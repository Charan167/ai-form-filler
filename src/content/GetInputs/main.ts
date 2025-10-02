import { IFormFields } from "./Iinputs";

export default function getInputs() {
  let formFields: IFormFields[] = [];
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
      element.id = "index-" + index;
      // element.id = crypto.randomUUID();
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
      specs: getFieldSpecs(element),
      outContext: getFieldContext(element),
      positionOnScreen: getElementPosition(element),
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

function getFieldSpecs(
  element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
) {
  const type = element.type || element.tagName.toLowerCase();
  const constraints = {
    required: element.hasAttribute("required"),
    minLength: ("minLength" in element && element?.minLength) || null,
    maxLength: ("maxLength" in element && element?.maxLength) || null,
    pattern: ("pattern" in element && element?.pattern) || null,
    min: ("min" in element && element.min) || null,
    max: ("max" in element && element.max) || null,
    step: ("step" in element && element.step) || null,
  };

  let options: Record<string, string>[] = [];
  if (element.tagName === "SELECT") {
    options =
      ("options" in element &&
        Array.from(element.options).map((opt) => ({
          value: opt.value,
          text: opt.textContent.trim(),
        }))) ||
      [];
  }

  const semanticType = determineSemanticType(element);

  return {
    fieldType: type,
    semanticType: semanticType,
    constraints: constraints,
    options: options,
    placeholder: ("placeholder" in element && element.placeholder) || null,
    currentValue: element.value || null,
  };
}

function determineSemanticType(
  element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
) {
  const label = getFieldLabel(element).toLowerCase();
  const name = (element.name || "").toLowerCase();
  const id = (element.id || "").toLowerCase();
  const placeholder = (
    ("placeholder" in element && element.placeholder && element.placeholder) ||
    ""
  ).toLowerCase();
  const type = element.type || "";

  const allText = `${label} ${name} ${id} ${placeholder}`.toLowerCase();

  if (type === "email" || /email|e-mail/.test(allText)) {
    return "email";
  }

  if (type === "tel" || /phone|mobile|contact|number/.test(allText)) {
    return "phone";
  }

  if (/name|full.name|first.name|last.name|surname/.test(allText)) {
    return "name";
  }

  if (/address|street|city|zip|postal|country|state/.test(allText)) {
    return "address";
  }

  if (type === "date" || /date|birth|dob/.test(allText)) {
    return "date";
  }

  if (type === "password") {
    return "password";
  }

  if (type === "number" || /age|quantity|amount|count/.test(allText)) {
    return "number";
  }

  if (type === "url" || /website|url|link/.test(allText)) {
    return "url";
  }

  if (/company|organization|employer|business/.test(allText)) {
    return "company";
  }

  if (/title|position|role|job/.test(allText)) {
    return "title";
  }

  return "text";
}
function getFieldContext(
  element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
) {
  const form = element.closest("form");
  const section = element.closest('section, div[class*="section"], fieldset');

  return {
    formId: form ? form.id || form.className || "unnamed-form" : null,
    formAction: form ? form.action : null,
    sectionClass: section ? section.className : null,
    sectionId: section ? section.id : null,
    fieldIndex: Array.from(form ? form.elements : [element]).indexOf(element),
  };
}

function getElementPosition(
  element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
  };
}
