import Component from "./Component.svelte";

const app = new Component({
  target: document.body,
  props: {
    name: "world"
  }
});

export default app;
