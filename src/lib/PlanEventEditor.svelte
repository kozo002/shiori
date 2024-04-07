<script lang="ts" context="module">
  export type PlanEventSavePayload = {
    title: string
    time: Date
    key?: string
  }

  export type PlanEventDeletePayload = {
    key: string
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { PlanEvent } from '$lib/types'
  import { toDate } from '$lib/utils/toDate'
  import Button from '$lib/components/ui/button/button.svelte'
  import Input from '$lib/components/ui/input/input.svelte'

  const dispatchEvent = createEventDispatcher<{
    save: PlanEventSavePayload
    delete: PlanEventDeletePayload
  }>()

  type Props = {
    baseDate: Date
    planEvent?: PlanEvent
    key?: string
  }
  const { baseDate, planEvent, key }: Props = $props()

  let title = $state('')
  let time = $state('')

  $effect(() => {
    title = planEvent?.title ?? ''
  })

  $effect(() => {
    if (planEvent === undefined) {
      return
    }
    const d = toDate(planEvent.time)
    time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  })

  function handleSubmit(e: Event) {
    e.preventDefault()
    const [hours, minutes] = time.split(':')
    const newTime = new Date(baseDate)
    newTime.setHours(Number(hours))
    newTime.setMinutes(Number(minutes))
    dispatchEvent('save', { title, time: newTime, key })
    if (key === undefined) {
      title = ''
      time = ''
    }
  }

  function handleDelete(e: Event) {
    e.preventDefault()
    if (key !== undefined && window.confirm('Are you sure you want to delete this event?')) {
      dispatchEvent('delete', { key })
    }
  }
</script>

<div class="flex pl-4 pt-2 gap-x-2">
  <form
    class="flex gap-x-2"
    on:submit="{handleSubmit}"
  >
    <Input
      type="text"
      bind:value="{title}"
    />
    <Input
      type="time"
      bind:value="{time}"
    />
    <Button type="submit">{key === undefined ? 'Add' : 'Update'}</Button>
  </form>
  {#if key !== undefined}
    <Button
      type="button"
      on:click="{handleDelete}"
    >
      Delete
    </Button>
  {/if}
</div>