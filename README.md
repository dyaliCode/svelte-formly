<p align="center">
  <img width="100%" height="300" src="./logo.png" alt="Svelte Formly" />
</p>

# Svelte Formly

by [@kamalkech](https://github.com/kamalkech)

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![CircleCI](https://circleci.com/gh/beyonk-adventures/svelte-component-livereload-template.svg?style=shield)](https://circleci.com/gh/beyonk-adventures/svelte-component-livereload-template) [![svelte-v3](https://img.shields.io/badge/svelte-v3-blueviolet.svg)](https://svelte.dev)

## Introduction

- ⚡️ Generate dynamic and reactive forms.
- 😍 Easy to extend with custom field type, custom validation.

## Documentation

[Link Documentation](https://svelte.formly-js.com/)

## Quick Installation

```shell
npm install svelte-formly
```

## Usage

```typescript
<script lang="ts">
  import { Formly, type IField } from 'svelte-formly';

  const form_name = 'formly_usage';
  const fields: IField[] = [
    {
      type: 'input', // required
      name: 'firstname', // required
      attributes: {
        type: 'text',
        id: 'firstname', // required
        classes: ['form-control'],
        placeholder: 'Tap your first name'
      },
      rules: ['required', 'min:3', 'max:10'],
      messages: {
        required: 'The firstname is required',
        min: 'Your firstname is too short min=3',
        max: 'Your firstname is too long max=10'
      }
    },
    {
      type: 'input', // required
      name: 'password', // required
      attributes: {
        type: 'password',
        id: 'password', // required
        classes: ['form-control'],
        placeholder: 'Tap your password',
        autocomplete: 'off'
      },
      rules: ['required', 'min:6', 'max:10'],
      messages: {
        required: 'The password is required',
        min: 'Your password is too short min=6',
        max: 'Your password is too long max=10'
      }
    }
  ];

  const onSubmit = ({ detail }: any) => {
    console.log('values:', detail);
  };
</script>

<Formly {fields} {form_name} on:submit={onSubmit} />
```
