<script lang="ts" context="module">
  export type PlanEditorSavePayload = {
    title: string
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import Input from '$lib/components/ui/input/input.svelte'

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

<form
  class="flex gap-x-2"
  on:submit="{handlePlanFormSubmit}"
>
  <Input
    type="text"
    bind:value="{title}"
  />
  <Button type="submit">Save</Button>
</form>