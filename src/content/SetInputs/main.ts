import wxtConfig from "@@/wxt.config";
import {
  IDiffHTMLTypes,
  IFieldInputData,
  ISetInputs,
  SetInputReturnFmt,
  SetInputStatus,
} from "./ISetinputs";

export default function SetInputsMain(
  data: IFieldInputData[],
): SetInputReturnFmt {
  if (!data || !data.length)
    return {
      status: SetInputStatus.ERROR,
      message: "No data provided",
      error: true,
    };
  let statusLog: SetInputReturnFmt[] = [];
  try {
    data.forEach((data) => {
      if (!data.fields.length) return;
      handleFields(data.fields, statusLog, data.formId);
    });
  } catch (error) {
    return {
      status: SetInputStatus.ERROR,
      message: "Error setting inputs" + error,
      error: true,
    };
  }
  if (statusLog.length) {
    return {
      status: SetInputStatus.ERROR,
      message: statusLog
        .map((log, index) => index + 1 + ". " + log.message)
        .join("\n"),
      error: true,
    };
  }
  return {
    status: SetInputStatus.SUCCESS,
    message: "Inputs set successfully",
    error: false,
  };
}

function handleFields(
  fields: ISetInputs[],
  statusLog: SetInputReturnFmt[],
  formId?: string,
) {
  fields.forEach((field) => {
    if (!field.elementId) {
      statusLog.push({
        status: SetInputStatus.ERROR,
        message: "No element id provided",
        error: true,
      });
      return;
    }
    const element: IDiffHTMLTypes = document.getElementById(
      field.elementId,
    ) as IDiffHTMLTypes;
    try {
      if (!element)
        throw {
          status: SetInputStatus.ERROR,
          message: `Element ${field.elementId} not found`,
          error: false,
        };

      const form = formId ? document.getElementById(formId) : null;
      if (form && !form.contains(element)) {
        console.warn(`Element ${field.elementId} is not inside form ${formId}`);
        throw {
          status: SetInputStatus.SKIPPED,
          message: `Element ${field.elementId} is not inside form ${formId}`,
          error: false,
        };
      }

      const suggestedValue = field.suggestedValue.replace(/[<>&'"]/g, "");

      if (setCheckBox(element, field, suggestedValue))
        throw {
          status: SetInputStatus.ERROR,
          message: "failed to set checkbox or radio",
          error: true,
        };
      if (setSelect(element, field, suggestedValue))
        throw {
          status: SetInputStatus.ERROR,
          message: "failed to set select",
          error: true,
        };

      if ("value" in element) {
        element.value = suggestedValue;
      }
      return {
        status: SetInputStatus.SUCCESS,
        message: "Input set successfully",
        error: false,
      };
    } catch (error: any) {
      console.error("data in error", error);
      statusLog.push(error as SetInputReturnFmt);
      return;
    } finally {
      if (element) {
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  });
}

function setCheckBox(
  element: IDiffHTMLTypes,
  field: ISetInputs,
  suggestedValue: string,
) {
  if (
    element instanceof HTMLInputElement &&
    (element.type === "checkbox" || element.type === "radio")
  ) {
    element.checked = suggestedValue === "true";
    return true;
  } else {
    return false;
  }
}

function setSelect(
  element: IDiffHTMLTypes,
  field: ISetInputs,
  suggestedValue: string,
) {
  if (element instanceof HTMLSelectElement) {
    element.value = suggestedValue;
    if (
      !Array.from(element.options).some(
        (option) => option.value === suggestedValue,
      )
    ) {
      console.warn(
        `could not find ${suggestedValue} in select ${field.elementId}`,
      );
      return false;
    }
    return true;
  }
}
