<script>
  import { createEventDispatcher, onMount } from "svelte";
  import clsx from "clsx";
  // Declar variables.
  export let id = false;
  export let name = "";
  export let placeholder = "Tap here...";
  export let multiple = false;
  export let loadItemes = [];
  let items = loadItemes;
  let itemsFiltered = [];
  let itemsSelected = [];
  let hideListItems = true;
  let useFilter = false;
  let value = null;

  const dispatch = createEventDispatcher();

  // Select item.
  const onSelectItem = item => {
    hideListItems = true;
    const oldSelected = itemsSelected.filter(s => s.id === item.id);
    if (oldSelected.length === 0) {
      itemsSelected = [...itemsSelected, item];
      items = items.filter(i => i.id != item.id);
    }
    if (useFilter) {
      itemsFiltered = items;
    }

    // Affect values.
    dispatch("changeValue", {
      name: name,
      value: itemsSelected
    });

    value = "";
  };

  // Delete tag
  const deleteTag = item => {
    itemsSelected = itemsSelected.filter(i => i.id != item.id);
    items = [...items, item];
    if (useFilter) {
      itemsFiltered = items;
    }

    // Affect values.
    dispatch("changeValue", {
      name: name,
      value: itemsSelected
    });
  };

  // Clear all items selected.
  function clearAll() {
    itemsSelected = [];
    items = loadItemes;
    if (useFilter) {
      itemsFiltered = items;
    }

    // Affect values.
    dispatch("changeValue", {
      name: name,
      value: itemsSelected
    });
  }

  // Filter item.
  const onFilter = e => {
    const keyword = e.target.value;
    if (keyword.length > 2) {
      hideListItems = false;
      const filtered = items.filter(entry => {
        return Object.values(entry).some(
          val => typeof val === "string" && val.includes(keyword)
        );
      });
      if (filtered.length > 0) {
        itemsFiltered = filtered;
      }
      useFilter = true;
    }
  };
</script>

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
  /* .spinner-wrapper {
    width: 30px;
    position: absolute;
    right: 0;
    top: 5px;
    margin: 0 5px;
  }
  .spinner {
    animation: rotate 1.4s linear infinite;
    -webkit-animation: rotate 1.4s linear infinite;
    -moz-animation: rotate 1.4s linear infinite;
    width: 30px;
    height: 30px;
    position: relative;
  }
  .spinner-dot {
    width: 274px;
    height: 274px;
    position: relative;
    top: 0;
  } */
  /* @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes rotate {
    to {
      -webkit-transform: rotate(360deg);
    }
  }
  @-moz-keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }
  .path {
    stroke-dasharray: 170;
    stroke-dashoffset: 20;
  } */
</style>

<div class="select-container">
  <!-- Selected item and clear button -->
  {#if itemsSelected.length > 0}
    {#each itemsSelected as itemSelected}
      <div class="item-selected {multiple ? 'tag' : ''}">
        <span>{itemSelected.title}</span>
        {#if multiple}
          <div class="clear" on:click={() => deleteTag(itemSelected)}>
            <svg
              width="100%"
              height="100%"
              viewBox="-2 -2 50 50"
              focusable="false">
              <path
                d="M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124
                l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z" />
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
        class="svelte-e3bo9s">
        <path
          fill="currentColor"
          d="M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124
          l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z" />
      </svg>
    </div>
  {/if}

  <!-- <div class="spinner-wrapper">
    <svg
      class="spinner"
      width="30px"
      height="30px"
      viewBox="0 0 66 66"
      xmlns="http://www.w3.org/2000/svg">
      <circle
        class="path"
        fill="transparent"
        stroke-width="2"
        cx="33"
        cy="33"
        r="30"
        stroke="url(#gradient)">
        <linearGradient id="gradient">
          <stop offset="50%" stop-color="#42d179" stop-opacity="1" />
          <stop offset="65%" stop-color="#42d179" stop-opacity=".5" />
          <stop offset="100%" stop-color="#42d179" stop-opacity="0" />
        </linearGradient>
      </circle>
      <svg
        class="spinner-dot dot"
        width="5px"
        height="5px"
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
        x="37"
        y="1.5">
        <circle class="path" fill="#42d179" cx="33" cy="33" r="30" />
      </svg>
    </svg>
  </div> -->

  <!-- Input to autocomplete -->
  <input
    {id}
    type="text"
    spellcheck="false"
    autocorrect="off"
    autocomplete="off"
    {placeholder}
    on:keyup={onFilter}
    bind:value />

  <!-- List items -->
  {#if !hideListItems}
    <div style="position: relative; width: 100%;">
      <div class="items-container">
        {#if useFilter}
          {#each itemsFiltered as item}
            <div
              class="item"
              on:click={() => {
                onSelectItem(item);
              }}>
              <span>{item.title}</span>
            </div>
          {/each}
        {:else}
          {#each items as item}
            <div
              class="item"
              on:click={() => {
                onSelectItem(item);
              }}>
              <span>{item.title}</span>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
</div>
