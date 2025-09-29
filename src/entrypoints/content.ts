import getInputs from "@/content/GetInputs/main";
import SetInputsMain from "@/content/SetInputs/main";

export default defineContentScript({
  matches: ["https://*/*"],
  main(ctx) {
    console.log("hello inputs", getInputs());
    console.log("hello set inputs", SetInputsMain(dummySuggestionData));
    console.log(dummySuggestionData);
  },
});
