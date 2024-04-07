<script lang="ts" context="module">
  export type PlanDateWithKey = PlanDate & { key: string }
  export type PlanEventWithKey = PlanEvent & { key: string }
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import { ref, onValue, set, push } from 'firebase/database'

  import { database } from '$lib/firebase.js'
  import type { Plan, PlanDate, PlanEvent } from '$lib/types.js'
  import { toDate } from '$lib/utils/toDate'

  import PlanEditor from '$lib/PlanEditor.svelte';
  import PlanDateEditor from '$lib/PlanDateEditor.svelte'
  import PlanEventEditor from '$lib/PlanEventEditor.svelte'
  import type { PlanEventSavePayload } from '$lib/PlanEventEditor.svelte'

  export let data;

  let plan: Plan | undefined

  onMount(async () => {
    const planRef = ref(database, `plans/${data.key}`)
    onValue(planRef, (snapshot) => {
      plan = snapshot.val()
    })
  })

  let planDates: PlanDateWithKey[] = []
  let planEvents: { [key in string]: PlanEventWithKey[] } = {}

  $: {
    if (plan?.planDates !== undefined) {
      planDates = Object.entries(plan.planDates)
        .map(([key, planDate]) => ({ ...planDate, key }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      planDates.forEach((planDate) => {
        if (planDate.planEvents !== undefined) {
          planEvents[planDate.key] = Object.entries(planDate.planEvents)
            .map(([key, planEvent]) => ({ ...planEvent, key }))
            .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
        }
      })
    }
  }

  async function handlePlanEditorSubmit(e: CustomEvent<{ planTitle: string }>) {
    const planRef = ref(database, `plans/${data.key}`)
    await set(planRef, { title: e.detail.planTitle })
  }

  async function handlePlanDateEditorSubmit(e: CustomEvent<{ title: string, date: Date, key?: string }>) {
    const { title, date, key } = e.detail
    if (key === undefined) {
      const planDatesRef = ref(database, `plans/${data.key}/planDates`)
      const newRef = await push(planDatesRef)
      await set(newRef, { title, date: date.toISOString() })
    } else {
      const planDateRef = ref(database, `plans/${data.key}/planDates/${key}`)
      await set(planDateRef, { title, date: date.toISOString() })
    }
  }

  async function handlePlanEventEditorSave(payload: PlanEventSavePayload, planDate: PlanDateWithKey) {
    const { title, time, key } = payload
    if (key === undefined) {
      const planEventsRef = ref(database, `plans/${data.key}/planDates/${planDate.key}/planEvents`)
      const newRef = await push(planEventsRef)
      await set(newRef, { title, time: time.toISOString() })
    } else {
      const planEventRef = ref(database, `plans/${data.key}/planDates/${planDate.key}/planEvents/${key}`)
      await set(planEventRef, { title, time: time.toISOString() })
    }
  }
</script>

{#if plan !== undefined}
  <PlanEditor
    planTitle={plan.title}
    on:save={handlePlanEditorSubmit}
  />

  {#each planDates as planDate (planDate.key)}
    <div>
      <PlanDateEditor
        planDate={planDate}
        key={planDate.key}
        on:save={handlePlanDateEditorSubmit}
      />
      <ul>
        {#if planEvents[planDate.key] !== undefined}
          {#each planEvents[planDate.key] as planEvent (planEvent.key)}
            <li>
              <PlanEventEditor
                baseDate="{toDate(planDate.date)}"
                planEvent="{planEvent}"
                key="{planEvent.key}"
                on:save="{(e) => handlePlanEventEditorSave(e.detail, planDate)}"
              />
            </li>
          {/each}
        {/if}
        <li>
          <PlanEventEditor
            baseDate="{toDate(planDate.date)}"
            on:save="{(e) => handlePlanEventEditorSave(e.detail, planDate)}"
          />
        </li>
      </ul>
    </div>
  {/each}

  <PlanDateEditor
    planDate={undefined}
    key={undefined}
    on:save={handlePlanDateEditorSubmit}
  />
{/if}
