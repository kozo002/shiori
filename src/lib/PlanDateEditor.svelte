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
  import type { Plan, PlanDate } from '$lib/types'
  import { toDateInputValue } from '$lib/utils/toDateInputValue'
  import { toDate } from '$lib/utils/toDate'

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

<div style="display: flex">
  <form on:submit="{handleSubmit}">
    <input
      type="text"
      bind:value="{title}"
    />
    <input
      type="date"
      bind:value="{date}"
    />
    <button type="submit">{planDate === undefined ? 'Add' : 'Update'}</button>
  </form>
  {#if key !== undefined}
    <button
      type="button"
      on:click="{handleDelete}"
    >
      Delete
    </button>
  {/if}
</div>