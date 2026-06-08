export type FeedbackTone = "correct" | "incorrect" | "complete";

export function speakEnglish(text: string) {
  if (
    typeof window === "undefined" ||
    !("speechSynthesis" in window) ||
    typeof SpeechSynthesisUtterance === "undefined"
  ) {
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function playFeedbackTone(tone: FeedbackTone) {
  if (typeof window === "undefined") {
    return;
  }

  const audioWindow = window as typeof window & {
    webkitAudioContext?: typeof AudioContext;
  };
  const AudioContextConstructor =
    audioWindow.AudioContext || audioWindow.webkitAudioContext;

  if (!AudioContextConstructor) {
    return;
  }

  try {
    const context = new AudioContextConstructor();
    const gain = context.createGain();
    const notes =
      tone === "correct"
        ? [
            { frequency: 523.25, start: 0, duration: 0.08 },
            { frequency: 659.25, start: 0.08, duration: 0.1 },
            { frequency: 783.99, start: 0.18, duration: 0.14 },
          ]
        : tone === "complete"
          ? [
              { frequency: 523.25, start: 0, duration: 0.08 },
              { frequency: 659.25, start: 0.08, duration: 0.08 },
              { frequency: 783.99, start: 0.16, duration: 0.08 },
              { frequency: 1046.5, start: 0.24, duration: 0.18 },
            ]
          : [
              { frequency: 220, start: 0, duration: 0.1 },
              { frequency: 164.81, start: 0.1, duration: 0.16 },
            ];

    gain.connect(context.destination);
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5);

    notes.forEach((note) => {
      const oscillator = context.createOscillator();
      oscillator.type = tone === "incorrect" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(
        note.frequency,
        context.currentTime + note.start,
      );
      oscillator.connect(gain);
      oscillator.start(context.currentTime + note.start);
      oscillator.stop(context.currentTime + note.start + note.duration);
    });

    window.setTimeout(() => void context.close(), 700);
  } catch {
    // Sound is optional. UI feedback still works when browsers block audio.
  }
}

