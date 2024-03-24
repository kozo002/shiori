<script lang="ts">
  import { push, ref, set, get } from 'firebase/database'
  import { database } from '../lib/firebase'

  import { goto } from '$app/navigation'

  async function handleClick() {
    const newPlan = { title: 'My Plan' }
    const newRef = await push(ref(database, 'plans'))
    await set(newRef, newPlan)
    const plan = await get(newRef)
    if (plan.key !== null) {
      goto(`/plans/${plan.key}`)
    }
  }
</script>

<button
  type="button"
  on:click={handleClick}
>
  Create a new Plan
</button>
