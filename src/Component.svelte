<script>
  import { get } from "svelte/store";
  import { values_form } from "./index";
  import Form from "./Form.svelte";

  const data = get(values_form);
  console.log("data", data);
</script>

<!-- <svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
  />
</svelte:head> -->

<h2>Values</h2>
<pre>
  <code>{JSON.stringify($values_form, null, 2)}</code>
</pre>
<hr />
<Form />
