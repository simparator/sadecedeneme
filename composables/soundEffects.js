export function setupGlobalClickSound() {
	const playSound = () => {
		const clickAudio = new Audio('/soundeffects/click.mp3');
		clickAudio.volume = 0.2;

		clickAudio.play();

		clickAudio.addEventListener('ended', () => {
			clickAudio.remove(); // Enlève la référence si besoin
		});
	};

	document.addEventListener('mousedown', playSound);

}

export function setupGlobalKeySound() {
	const playSound = () => {
		const keyAudio = new Audio('/soundeffects/keypress.wav');
		keyAudio.volume = 0.2;

		keyAudio.play();

		keyAudio.addEventListener('ended', () => {
			keyAudio.remove(); // Enlève la référence si besoin
		});
	};

	document.addEventListener('keydown', playSound);

}
