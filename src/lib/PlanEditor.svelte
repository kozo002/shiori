<script lang="ts" context="module">
  export type PlanEditorSavePayload = {
    title: string
  }
</script>
<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  type Props = {
    title: string
  }
  let { title }: Props = $props()

  const dispatch = createEventDispatcher<{ save: PlanEditorSavePayload }>()

  async function handlePlanFormSubmit(e: Event) {
    e.preventDefault()
    if (title.length === 0) {
      return
    }
    dispatch('save', { title })
  }
</script>

<form on:submit="{handlePlanFormSubmit}">
  <input
    type="text"
    bind:value="{title}"
  />
  <button type="submit">Save</button>
</form>