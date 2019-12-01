import Component from "./Component.svelte";

const app = new Component({
  target: document.body,
  props: {
    // assuming App.svelte contains something like
    // `export let answer`:
    answer: 42
  }
});
