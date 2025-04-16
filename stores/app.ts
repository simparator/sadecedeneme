// stores/terminal.ts
import { defineStore } from 'pinia'

export const useTerminalStore = defineStore('terminal', {
	state: () => ({
		loading: false,
		error: null as string | null,

		serverAddress: 'localhost',

		manifest: null,

		user: null,

		windowZ: 100,

	}),

	getters: {
		manifestData: (state) => state.manifest,
		userData: (state) => state.user,
		serverAddressData: (state) => state.serverAddress,
		serverName: (state) => state.manifest?.serverName ?? 'Inconnu',
		iconPath: (state) =>
			state.manifest
				? `/config/network/${state.manifest.serverAddress}/${state.manifest.iconName}`
				: '',
		terminalID: (state) => state.manifest?.terminalID ?? '???'
	},


	actions: {
		async loadManifest(serverName: string) {
			this.loading = true
			this.error = null
			this.serverAddress = serverName
			try {
				this.manifest = await $fetch(`/config/network/${serverName}/manifest.json`)
			} catch (err: any) {
				this.error = `Erreur de chargement du manifest: ${err.message}`
				this.manifest = null
			} finally {
				this.loading = false
			}
		},

		setUser(user) {
			this.user = user
		},

		setServerAddress(server) {
			this.serverAddress = server
		},

		setWindowZ() {
			this.windowZ++
		},

	}
})
