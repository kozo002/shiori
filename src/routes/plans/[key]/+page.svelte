<script lang="ts">
  import { onMount } from 'svelte'
  import { ref, onValue, set, push } from 'firebase/database'

  import { database } from '$lib/firebase.js'
  import type { Plan, PlanDate } from '$lib/types.js'

  import PlanEditor from '$lib/PlanEditor.svelte';
  import PlanDateEditor from '$lib/PlanDateEditor.svelte'

  export let data;

  let plan: Plan | undefined

  onMount(async () => {
    const planRef = ref(database, `plans/${data.key}`)
    onValue(planRef, (snapshot) => {
      plan = snapshot.val()
    })
  })

  let planDates: (PlanDate & { key: string })[] = []

  $: {
    if (plan?.planDates !== undefined) {
      planDates = Object.entries(plan.planDates)
        .map(([key, planDate]) => ({ ...planDate, key }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }
  }

  async function handlePlanEditorSubmit(e: CustomEvent<{ planTitle: string }>) {
    const planRef = ref(database, `plans/${data.key}`)
    await set(planRef, { title: e.detail.planTitle })
  }

  async function handlePlanDateEditorSubmit(e: CustomEvent<{ title: string, date: Date, key?: string }>) {
    const { title, date, key } = e.detail
    const planDatesRef = ref(database, `plans/${data.key}/planDates`)
    if (key === undefined) {
      const newRef = await push(planDatesRef)
      await set(newRef, { title, date: date.toISOString() })
    } else {
      const planDateRef = ref(database, `plans/${data.key}/planDates/${key}`)
      await set(planDateRef, { title, date: date.toISOString() })
    }
  }
</script>

{#if plan !== undefined}
  <PlanEditor
    planTitle={plan.title}
    on:save={handlePlanEditorSubmit}
  />

  {#each planDates as planDate (planDate.key)}
    <PlanDateEditor
      planDate={planDate}
      key={planDate.key}
      on:save={handlePlanDateEditorSubmit}
    />
  {/each}

  <PlanDateEditor
    planDate={undefined}
    key={undefined}
    on:save={handlePlanDateEditorSubmit}
  />
{/if}
