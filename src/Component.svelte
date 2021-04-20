<script>
  import { afterUpdate } from 'svelte';
  import { get } from 'svelte/store';
  import { valuesForm, Field } from './index';
  import { fieldsStore } from './lib/stores';

  let colorBorder;
  // $: valid = $valuesForm.valid;
  let data = $valuesForm;
  $: values = data;

  const fetchUsers = async () => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users?_limit=2`
    );
    const items = await res.json();
    return items.map((item) => {
      return { value: item.id, title: item.username };
    });
  };

  const fetchPosts = async () => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_start=5&_limit=2`
    );
    const items = await res.json();
    return items.map((item) => {
      return { value: item.id, title: item.title };
    });
  };

  const settings = {
    style: 'bootstrap',
  };

  const fields = [
    {
      type: 'autocomplete', // required
      name: 'name-field-autocomplete', // required
      attributes: {
        id: 'id-field-autocomplete', // required
        multiple: false, // optional
        label: 'autos',
      },
      rules: ['required'],
      loadItemes: [
        // list items with id and title attributes.
        {
          id: 1,
          title: 'item 1',
        },
        {
          id: 2,
          title: 'item 2',
        },
        {
          id: 3,
          title: 'item 3',
        },
        {
          id: 4,
          title: 'item 4',
        },
      ],
    },
  ];

  function onSubmit() {
    const data = get(valuesForm);
    console.log(`data.onSubmit`, data);
  }

  afterUpdate(() => {
    data = get(valuesForm);
    console.log(`data`, data);
  });
</script>

<pre>
  <code>
    {JSON.stringify(values, null, 2)}
  </code>
</pre>
<div class="container">
  <div class="row">
    <div class="col-md-12">
      <form on:submit|preventDefault={onSubmit}>
        <Field {fields} {settings} />
        <div class="form-group">
          <div class="select-container ">
            <div class="item-selected tag ">
              <span>item 1</span>
              <div class="clear ">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="-2 -2 50 50"
                  focusable="false"
                  class=""
                  ><path
                    d="M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124
                l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"
                  /></svg
                >
              </div>
            </div>
            <div class="item-selected tag ">
              <span>item 2</span>
              <div class="clear ">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="-2 -2 50 50"
                  focusable="false"
                  class=""
                  ><path
                    d="M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124
                l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"
                  /></svg
                >
              </div>
            </div>
            <div class="clear-all ">
              <svg
                width="100%"
                height="100%"
                viewBox="-2 -2 50 50"
                focusable="false"
                role="presentation"
                class="svelte-e3bo9s"
                ><path
                  fill="currentColor"
                  d="M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124
          l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"
                /></svg
              >
            </div>
            <input
              id="id-field-autocomplete"
              type="text"
              spellcheck="false"
              autocorrect="off"
              autocomplete="off"
              placeholder="Tap here..."
              class=""
            />
          </div>
        </div>
        <button class="btn btn-primary btn-lg btn-block" type="submit"
          >Submit</button
        >
      </form>
    </div>
  </div>
</div>

<svelte:head>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6"
    crossorigin="anonymous"
  />
</svelte:head>

<style>
  :global(.invalid-feedback) {
    display: block !important;
  }
  :global(.form-group) {
    margin-bottom: 20px;
    padding: 20px;
    /* border: solid 1px var(--theme-color-border); */
  }

  .select-container {
    border: solid 1px #dddddd;
    border-radius: 4px;
    height: auto;
    position: relative;
    display: flex;
    flex-wrap: wrap;
  }
  .select-container input {
    border: none;
    padding: 0 15px;
    height: 40px;
    width: 100%;
    /* position: absolute; */
    box-sizing: border-box;
  }
  .items-container {
    box-shadow: 0 2px 3px 0 rgba(44, 62, 80, 0.24);
    background: #ffffff;
    border-radius: 0 0 5px 5px;
    overflow-y: auto;
    position: absolute;
    top: 0;
    z-index: 2;
    width: 100%;
  }
  .items-container .item,
  .item-selected {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    overflow: hidden;
  }
  .items-container .item:first-child,
  .items-container .item:hover {
    background-color: #fbd5c8;
    cursor: pointer;
  }
  .item-selected,
  .clear-all {
    position: absolute;
    z-index: 2;
  }
  .item-selected {
    display: flex;
    flex-wrap: wrap;
  }
  .clear-all {
    right: 20px;
    width: 20px;
    height: 40px;
    cursor: pointer;
  }
  .clear {
    cursor: pointer;
  }
  .tag {
    background-color: #ddd;
    border-radius: 15px;
    height: 25px;
    line-height: 25px;
    margin: 8px 5px;
    padding: 0 30px 0 10px;
    position: relative;
    display: flex;
    flex-wrap: wrap;
  }
  .tag .clear {
    box-shadow: 0 2px 3px 0 rgba(44, 62, 80, 0.24);
    border-radius: 50%;
    width: 15px;
    height: 15px;
    padding: 2px;
    position: absolute;
    right: 5px;
    top: 3px;
    background-color: #ff3e00;
  }
  .tag .clear:hover {
    background-color: #fbd5c8;
  }
  .tag .clear svg {
    fill: white;
    vertical-align: top;
  }
  input:focus {
    outline: none;
  }
</style>
