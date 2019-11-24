<p align="center">
  <img width="100%" height="300" src="./logo.png" alt="Svelte Formly" />
</p>

# Svelte Formly

by [@kamalkech](https://github.com/kamalkech)

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![CircleCI](https://circleci.com/gh/beyonk-adventures/svelte-component-livereload-template.svg?style=shield)](https://circleci.com/gh/beyonk-adventures/svelte-component-livereload-template) [![svelte-v3](https://img.shields.io/badge/svelte-v3-blueviolet.svg)](https://svelte.dev)

## Features

- ⚡️ Generate Forms
- 😍 Easy to extend with custom field type, validation, wrapper and extension.

## Installation

npm i svelte-formly

## Usage

```javascript
<script>
  import { onDestroy } from "svelte";
  import { valuesForm, Field } from "svelte-formly";

  let message = "";

  const fields = [
    {
      type: "text",
      name: "firstname",
      value: "",
      id: "firstname",
      classe: "any-class",
      placeholder: "Tap your first name",
      validation: ["required", "min:6"]
    },
    {
      type: "text",
      name: "lastname",
      value: "",
      id: "lastname",
      placeholder: "Tap your lastname"
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
      radios: [
        {
          id: 'female',
          value: 'female',
          title: 'Female'
        },
        {
          id: 'male',
          value: 'male',
          title: 'Male'
        }
      ]
    }
    {
      type: "select",
      name: "city",
      id: "city",
      label: "City",
      validation: ["required"],
      options: [
        {
          {
            value: 1,
            title: 'Agadir'
          },
          {
            value: 2,
            title: 'Casablanca'
          }
        }
      ]
    }
  ];

  function onSubmit() {
    valuesForm.subscribe(data => {
      if (data.isValidForm) {
        message = "Congratulation! now your form is valid";
      } else {
        message = "Your form is not valid!";
      }
    });
  }

  onDestroy(valuesForm);
</script>
```

Inputs : text, password, email, number, tel

```javascript
<script>
  fields = [
    {
      type: "text", // or password, email, number, tel, required
      name: "namefield", // required
      id: "idfield", // required
      classe: "", // optional
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
      classe: "", // optional
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
      classe: "", // optional
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
      classe: "", // optional
      label: "", // optional
      disabled: false, // optional
      radios: [
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

List rules to validate form.

```javascript
<script>
  fields = [
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
      ]
    }
  ]
</script>
```

```html
<h2>{message}</h2>
<form on:submit|preventDefault="{onSubmit}" novalidate>
  <Field {fields} />
  <button class="btn btn-primary" type="submit">Submit</button>
</form>
```
