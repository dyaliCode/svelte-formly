<script>
  import { afterUpdate, createEventDispatcher, onMount } from 'svelte';

  // Declar variables.
  export let field = {};
  const defaultAttributes = {
    id: '',
    spellcheck: false,
    autocorrect: 'off',
    autocomplete: 'off',
    placeholder: 'Tap here...',
  };
  const fieldAttributes = field.attributes ? field.attributes : {};
  field.attributes = { ...defaultAttributes, ...fieldAttributes };

  const defaultExtra = {
    loadItemes: [],
    multiple: false,
  };
  const fieldExtra = field.extra ? field.extra : {};
  field.extra = { ...defaultExtra, ...fieldExtra };

  let items = field.extra.loadItemes;
  let itemsFiltered = [];
  let itemsSelected = [];
  let hideListItems = true;
  let useFilter = false;
  let value = null;

  const dispatch = createEventDispatcher();

  // Select item.
  const onSelectItem = (item) => {
    hideListItems = true;
    const oldSelected = itemsSelected.filter((s) => s.value === item.value);
    if (oldSelected.length === 0) {
      itemsSelected = [...itemsSelected, item];
      items = items.filter((i) => i.value != item.value);
    }
    if (useFilter) {
      itemsFiltered = items;
    }

    // Affect values.
    dispatch('changeValue', {
      name: field.name,
      value: itemsSelected,
    });

    value = '';

    // placeholder
    field.attributes.placeholder = field.extra.multiple
      ? field.attributes.placeholder
      : '';
  };

  // Delete tag
  const deleteTag = (item) => {
    itemsSelected = itemsSelected.filter((i) => i.value != item.value);
    items = [...items, item];
    if (useFilter) {
      itemsFiltered = items;
    }

    // Affect values.
    dispatch('changeValue', {
      name: field.name,
      value: itemsSelected,
    });
  };

  // Clear all items selected.
  function clearAll() {
    itemsSelected = [];
    items = field.extra.loadItemes;
    if (useFilter) {
      itemsFiltered = items;
    }

    // Affect values.
    dispatch('changeValue', {
      name: field.name,
      value: itemsSelected,
    });
  }

  // Filter item.
  const onFilter = (e) => {
    const keyword = e.target.value;
    if (keyword.length > 2) {
      hideListItems = false;
      const filtered = items.filter((entry) => {
        return Object.values(entry).some(
          (val) => typeof val === 'string' && val.includes(keyword)
        );
      });
      if (filtered.length > 0) {
        itemsFiltered = filtered;
        useFilter = true;
      } else {
        itemsFiltered = [];
        useFilter = false;
      }
      hideListItems = useFilter > 0 ? false : true;
    } else {
      hideListItems = true;
    }
  };
</script>

<div class="select-container">
  {#if itemsSelected.length > 0}
    {#each itemsSelected as itemSelected}
      <div class="item-selected {field.extra.multiple ? 'tag' : ''}">
        <span>{itemSelected.title}</span>
        {#if field.extra.multiple}
          <div class="clear" on:click={() => deleteTag(itemSelected)}>
            <svg
              width="100%"
              height="100%"
              viewBox="-2 -2 50 50"
              focusable="false"
            >
              <path
                d="M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124
                l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"
              />
            </svg>
          </div>
        {/if}
      </div>
    {/each}
    <div class="clear-all" on:click={clearAll}>
      <svg
        width="100%"
        height="100%"
        viewBox="-2 -2 50 50"
        focusable="false"
        role="presentation"
        class="svelte-e3bo9s"
      >
        <path
          fill="currentColor"
          d="M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124
          l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"
        />
      </svg>
    </div>
  {/if}

  <input
    id={field.attributes.id}
    type="text"
    spellcheck={field.attributes.spellcheck}
    autocorrect={field.attributes.autocorrect}
    autocomplete={field.attributes.autocomplete}
    placeholder={field.attributes.placeholder}
    on:keyup={onFilter}
    bind:value
  />

  {#if !hideListItems}
    <div style="position: relative; width: 100%;">
      <div class="items-container">
        {#if useFilter}
          {#each itemsFiltered as item}
            <div
              class="item"
              on:click={() => {
                onSelectItem(item);
              }}
            >
              <span>{item.title}</span>
            </div>
          {/each}
        {:else}
          {#each items as item}
            <div
              class="item"
              on:click={() => {
                onSelectItem(item);
              }}
            >
              <span>{item.title}</span>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
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
