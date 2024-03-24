<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import type { PlanDate } from '$lib/types'
  import { toDateInputValue } from '$lib/utils/toDateInputValue'
  import { toDate } from '$lib/utils/toDate'

  type Props = {
    planDate: PlanDate | undefined
    key: string | undefined
  }
  let { planDate, key }: Props = $props()

  const dispatch = createEventDispatcher<{
    save: { title: string, date: Date, key?: string }
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
</script>

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
