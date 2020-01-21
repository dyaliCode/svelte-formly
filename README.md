<p align="center">
  <img width="100%" height="300" src="./logo.png" alt="Svelte Formly" />
</p>

# Svelte Formly

by [@kamalkech](https://github.com/kamalkech)

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![CircleCI](https://circleci.com/gh/beyonk-adventures/svelte-component-livereload-template.svg?style=shield)](https://circleci.com/gh/beyonk-adventures/svelte-component-livereload-template) [![svelte-v3](https://img.shields.io/badge/svelte-v3-blueviolet.svg)](https://svelte.dev)

## Features

- ⚡️ Generate dynamic forms for sveltejs / Sapper js.
- 😍 Easy to extend with custom field type, custom validation.

## Installation

npm i svelte-formly

## Usage

```javascript
<script>
  import { get } from "svelte/store";
  import { valuesForm, Field } from "svelte-formly";

  const fields = [
    {
      type: "color",
      name: "color",
      id: "color",
      label: "Color Form"
    },
    {
      type: "text",
      name: "firstname",
      value: "",
      id: "firstname",
      class: ["form-control"],
      placeholder: "Tap your first name",
      validation: ["required", "min:6"],
      messages: {
        required: "Firstname field is required!",
        min: "First name field must have more that 6 caracters!"
      }
    },
    {
      prefix: {
        class: ["custom-form-group"]
      },
      type: "text",
      name: "lastname",
      value: "",
      id: "lastname",
      placeholder: "Tap your lastname",
      description: {
        class: ["custom-class-desc"],
        text: "Custom text for description"
      }
    },
    {
      type: "email",
      name: "email",
      value: "",
      id: "email",
      placeholder: "Tap your email",
      validation: ["required", "email"]
    },
    {
      type: "radio",
      name: "gender",
      items: [
        {
          id: "female",
          value: "female",
          title: "Female"
        },
        {
          id: "male",
          value: "male",
          title: "Male"
        }
      ]
    },
    {
      type: "select",
      name: "city",
      id: "city",
      label: "City",
      validation: ["required"],
      options: [
        {
          value: 1,
          title: "Agadir"
        },
        {
          value: 2,
          title: "Casablanca"
        }
      ]
    }
  ];

  let message = "";
  let values = {};
  let color = "#ff3e00";

  function onSubmit() {
    const data = get(valuesForm);
    if (data.isValidForm) {
      values = data.values;
      color = values.color ? values.color : color;
      message = "Congratulation! now your form is valid";
    } else {
      message = "Your form is not valid!";
    }
  }
</script>
```

```css
<style>
  * {
    color: var(--theme-color);
  }
  .custom-form :global(.form-group) {
    padding: 10px;
    border: solid 1px var(--theme-color);
    margin-bottom: 10px;
  }
  .custom-form :global(.custom-form-group) {
    padding: 10px;
    background: var(--theme-color);
    color: white;
    margin-bottom: 10px;
  }
  .custom-form :global(.class-description) {
    color: var(--theme-color);
  }
</style>
```

```html
<h1 style="--theme-color: {color}">Svelte Formly</h1>
<h3>{message}</h3>
<form
  on:submit|preventDefault="{onSubmit}"
  class="custom-form"
  style="--theme-color: {color}"
>
  <Field {fields} />
  <button class="btn btn-primary" type="submit">Submit</button>
</form>
```

<hr>

## For Sapper

npm i -D svelte-formly

```javascript
<script context="module">
  export async function preload({ params, query }) {
    const module = await import("svelte-formly");
    const Field = module.Field;
    const valuesForm = module.valuesForm;
    return { Field, valuesForm };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  export let Field;
  export let valuesForm;

  const fields = [
    {
      type: "text",
      name: "username",
      id: "username",
      validation: ["required"],
      messages: {
        required: "Username is required!"
      }
    },
    {
      type: "email",
      name: "email",
      id: "email",
      validation: ["required", "email"],
      messages: {
        required: "E-mail is required!"
      }
    }
  ];

  function onSubmit() {
    const data = get(valuesForm);
    if (data.isValidForm) {
      const values = data.values;
      console.log('values', values);
    }
  }
</script>
```

```html
<form on:submit|preventDefault="{onSubmit}">
  <svelte:component this="{Field}" {fields} />
  <button type="submit">Submit</button>
</form>
```

<hr>

### Params

Inputs : text, password, email, number, tel

```javascript
<script>
  fields = [
    {
      type: "text", // or password, email, number, tel, required
      name: "namefield", // required
      id: "idfield", // required
      class: "", // optional
      value: "", // optional
      label: "", // optional
      placeholder: "", // optional
      min: null, // optional
      max: null, // optional
      disabled: false, // optional
      validation: [] // optional
    }
  ]
</script>
```

Textarea

```javascript
<script>
  fields = [
    {
      type: "textarea", // required
      name: "namefield", // required
      id: "idfield", // required
      class: "", // optional
      value: "", // optional
      label: "", // optional
      disabled: false, // optional
      rows: null, // optional
      cols: null, // optional
      validation: [] // optional
    }
  ]
</script>
```

Select

```javascript
<script>
  fields = [
    {
      type: "select", // required
      name: "namefield", // required
      id: "idfield", // required
      class: "", // optional
      label: "", // optional
      disabled: false, // optional
      options: [
        {
          value: 1,
          title: 'option 1'
        },
        {
          value: 2,
          title: 'option 2'
        }
      ], // required
      validation: [] // optional
    }
  ]
</script>
```

Radio

```javascript
<script>
  fields = [
    {
      type: "radio", // required
      name: "namefield", // required
      id: "idfield", // required
      class: "", // optional
      label: "", // optional
      disabled: false, // optional
      items: [
        {
          id: 'radio1',
          value: 1,
          title: 'radio 1'
        },
        {
          id: 'radio2',
          value: 2,
          title: 'radio 2'
        }
      ], // required
      validation: [] // optional
    }
  ]
</script>
```

Color

```javascript
<script>
  fields = [
    {
      type: "color", // required
      name: "namefield", // required
      id: "idfield", // required
      class: "", // optional
      label: "", // optional
      disabled: false, // optional
      value: "#ff3e00" // optional
    }
  ]
</script>
```

Range

```javascript
<script>
  fields = [
    {
      type: "range", // required
      name: "namefield", // required
      id: "idfield", // required
      class: "", // optional
      label: "", // optional
      min: 10, // required
      max: 100, // required
      step: 10 // required
    }
  ]
</script>
```

<hr>

Autocomplete

```javascript
<script>
  fields = [
    {
      type: "autocomplete", // required
      name: "namefield", // required
      id: "idfield", // required
      multiple: true, // optional
      loadItemes: [ // list items with id and title attributes.
        {
          id: 1,
          title: "item 1"
        },
        {
          id: 2,
          title: "item 2"
        },
        {
          id: 3,
          title: "item 3"
        },
        {
          id: 4,
          title: "item 4"
        }
      ]
    }
  ]
</script>
```

<hr>

File

```javascript
<script>
  fields = [
    {
      type: "file", // required
      name: "namefield", // required
      id: "idfield", // required
      multiple: true, // optional
      showPreview: true // optional
    }
  ]
</script>
```

<hr>

### Validation

List rules to validate form.

```javascript
<script>
  const fields = [
    {
      ...,
      validation: [
        'required',
        'min:number',
        'max:number',
        'between:number:number',
        'equal:number',
        'email',
        'url'
        fnc
      ]
    }
  ];
</script>
```

Validation with custom rule

```javascript
<script>
  import { get } from "svelte/store";
  import { Field, valuesForm } from "svelte-formly";

  const fields = [
    {
      type: "text",
      name: "firstname",
      id: "firstname",
      validation: ["required"]
    },
    {
      type: "text",
      name: "lastname",
      id: "lastname",
      validation: ["required", notEqual, customRule2],
      messages: {
        notEqual: "Last name not equal to First name", // Custom message error, property name must equal to function name.
        customRule2: 'foo bar'
      }
    }
  ];

  // Custom rule to force field
  function notEqual() {
    const values = get(valuesForm).values;
    if (values.firstname === values.lastname) {
      return false;
    }
    return true;
  }

  function customRule2() {
    // ...others conditions.
  }
</script>
```
