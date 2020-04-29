import Component from "./Component.svelte";

const target = document.createElement("div");
document.body.appendChild(target);

new Component({
  target,
  props: {},
});
