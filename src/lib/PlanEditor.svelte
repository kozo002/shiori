<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  type Props = {
    planTitle: string
  }
  let { planTitle }: Props = $props()

  const dispatch = createEventDispatcher<{ save: { planTitle: string } }>()

  async function handlePlanFormSubmit(e: Event) {
    e.preventDefault()
    if (planTitle.length === 0) {
      return
    }
    dispatch('save', { planTitle })
  }
</script>

<form on:submit="{handlePlanFormSubmit}">
  <input
    type="text"
    bind:value="{planTitle}"
  />
  <button type="submit">Save</button>
</form>