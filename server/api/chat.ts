// server/api/chat.ts
export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { messages } = body

	const apiKey = process.env.NUXT_MISTRAL_SECRET
	const agentId = process.env.NUXT_AGENT_ID

	const response = await $fetch('https://api.mistral.ai/v1/agents/completions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		},
		body: {
			agent_id: agentId, // Mistral Agent ID
			messages,
		}
	})

	return response
})
