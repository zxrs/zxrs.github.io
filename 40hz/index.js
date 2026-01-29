const onload = () => {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(40, audio.currentTime);
    oscillator.connect(audio.destination);
    oscillator.start();
};

window.addEventListener("click", onload);
window.addEventListener("touchstart", onload);
