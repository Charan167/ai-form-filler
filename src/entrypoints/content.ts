import getInputs from "@/content/GetInputs/main";

export default defineContentScript({
  matches: ["https://*/*"],
  main(ctx) {
    console.log("hello inputs", getInputs());
  },
});
