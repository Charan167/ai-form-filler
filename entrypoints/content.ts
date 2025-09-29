import { getInputs } from "./GetInputs/main";

export default defineContentScript({
  matches: ["https://*/*"],
  main(ctx) {
    console.log("hello", getInputs());
  },
});
