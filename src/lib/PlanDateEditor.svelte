<script lang="ts" context="module">
  export type PlanDateSavePayload = {
    title: string
    date: Date
    key?: string    
  }

  export type PlanDateDeletePayload = {
    key: string
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { PlanDate } from '$lib/types'
  import { toDateInputValue } from '$lib/utils/toDateInputValue'
  import { toDate } from '$lib/utils/toDate'
  import Button from './components/ui/button/button.svelte'
  import Input from '$lib/components/ui/input/input.svelte'

  type Props = {
    planDate: PlanDate | undefined
    key: string | undefined
  }
  let { planDate, key }: Props = $props()

  const dispatch = createEventDispatcher<{
    save: PlanDateSavePayload
    delete: PlanDateDeletePayload
  }>()

  let title = $state('')
  let date = $state('')

  $effect(() => {
    title = planDate?.title ?? ''
  })

  $effect(() => {
    if (planDate === undefined) {
      return
    }
    const d = typeof planDate.date === 'string' ? toDate(planDate.date) : planDate.date
    date = toDateInputValue(d)
  })

  function handleSubmit(e: Event) {
    e.preventDefault()
    if (planDate === undefined) {
      dispatch('save', { title, date: new Date(date) })
      title = ''
      date = ''
    } else {
      dispatch('save', { title, date: new Date(date), key })
    }
  }

  function handleDelete(e: Event) {
    e.preventDefault()
    if (key === undefined) { return }
    if (window.confirm('Are you sure you want to delete this date?') === false) { return }
    if (planDate?.planEvents !== undefined && Object.keys(planDate.planEvents).length > 0) { return }

    console.log('test')
    dispatch('delete', { key })
  }
</script>

<div class="flex gap-x-2">
  <form
    class="flex gap-x-2"
    on:submit="{handleSubmit}"
  >
    <Input
      type="text"
      bind:value="{title}"
    />
    <Input
      type="date"
      bind:value="{date}"
    />
    <Button type="submit">{planDate === undefined ? 'Add' : 'Update'}</Button>
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