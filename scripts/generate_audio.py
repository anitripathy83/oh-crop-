import math
import wave
import struct
import random
import os

SAMPLE_RATE = 44100

def note_to_freq(note: str) -> float:
    """Converts note name like 'C4', 'D#4', 'A4' to frequency in Hz."""
    notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    name = note[:-1]
    octave = int(note[-1])
    # Handle flats if any
    flats = {'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'}
    if name in flats:
        name = flats[name]
    semitone = notes.index(name)
    # A4 is 440 Hz (octave 4, semitone 9)
    midi = 12 + octave * 12 + semitone
    return 440.0 * (2.0 ** ((midi - 69) / 12.0))

class Synth:
    def __init__(self, duration: float):
        self.num_samples = int(SAMPLE_RATE * duration)
        self.buffer = [0.0] * self.num_samples

    def add_square(self, start_t: float, dur: float, freq: float, duty: float = 0.5, volume: float = 0.2, attack=0.01, release=0.05):
        start_idx = int(start_t * SAMPLE_RATE)
        end_idx = min(self.num_samples, int((start_t + dur) * SAMPLE_RATE))
        period = SAMPLE_RATE / max(1.0, freq)

        for i in range(start_idx, end_idx):
            t = (i - start_idx) / SAMPLE_RATE
            env = 1.0
            if t < attack:
                env = t / attack
            elif t > dur - release:
                env = max(0.0, (dur - t) / release)

            phase = (i % period) / period
            val = 1.0 if phase < duty else -1.0
            self.buffer[i] += val * env * volume

    def add_triangle(self, start_t: float, dur: float, freq: float, volume: float = 0.25, attack=0.01, release=0.05):
        start_idx = int(start_t * SAMPLE_RATE)
        end_idx = min(self.num_samples, int((start_t + dur) * SAMPLE_RATE))
        period = SAMPLE_RATE / max(1.0, freq)

        for i in range(start_idx, end_idx):
            t = (i - start_idx) / SAMPLE_RATE
            env = 1.0
            if t < attack:
                env = t / attack
            elif t > dur - release:
                env = max(0.0, (dur - t) / release)

            phase = (i % period) / period
            val = 2.0 * abs(2.0 * (phase - math.floor(phase + 0.5))) - 1.0
            self.buffer[i] += val * env * volume

    def add_noise(self, start_t: float, dur: float, volume: float = 0.15, decay: float = 0.1):
        start_idx = int(start_t * SAMPLE_RATE)
        end_idx = min(self.num_samples, int((start_t + dur) * SAMPLE_RATE))

        for i in range(start_idx, end_idx):
            t = (i - start_idx) / SAMPLE_RATE
            env = math.exp(-t / max(0.01, decay))
            val = random.uniform(-1.0, 1.0)
            self.buffer[i] += val * env * volume

    def add_kick(self, start_t: float, dur: float = 0.18, volume: float = 0.35):
        start_idx = int(start_t * SAMPLE_RATE)
        end_idx = min(self.num_samples, int((start_t + dur) * SAMPLE_RATE))
        phase = 0.0

        for i in range(start_idx, end_idx):
            t = (i - start_idx) / SAMPLE_RATE
            # pitch drops from 150Hz to 40Hz
            freq = 40.0 + 110.0 * math.exp(-t * 28.0)
            env = math.exp(-t * 12.0)
            phase += 2.0 * math.pi * freq / SAMPLE_RATE
            # Triangle-distorted punch
            val = math.sin(phase)
            if val > 0.5: val = 0.5 + 0.5 * (val - 0.5)
            elif val < -0.5: val = -0.5 + 0.5 * (val + 0.5)
            self.buffer[i] += val * env * volume

    def add_snare(self, start_t: float, dur: float = 0.15, volume: float = 0.22):
        self.add_noise(start_t, dur, volume=volume * 0.9, decay=0.08)
        self.add_triangle(start_t, dur * 0.5, freq=180.0, volume=volume * 0.6, attack=0.002, release=0.05)

    def add_hihat(self, start_t: float, dur: float = 0.04, volume: float = 0.08):
        self.add_noise(start_t, dur, volume=volume, decay=0.02)

    def write_wav(self, filepath: str):
        # Soft-clip and normalize
        max_val = max(0.01, max(abs(s) for s in self.buffer))
        norm_factor = 0.85 / max(0.85, max_val)

        with wave.open(filepath, 'w') as wav:
            wav.setnchannels(1)
            wav.setsampwidth(2)
            wav.setframerate(SAMPLE_RATE)
            frames = bytearray()
            for sample in self.buffer:
                s = sample * norm_factor
                # soft clipping
                s = math.tanh(s)
                val = int(max(-32767, min(32767, s * 32767.0)))
                frames.extend(struct.pack('<h', val))
            wav.writeframes(frames)


def generate_menu():
    """Generates 104 BPM chill 8-bit boom-bap campus vibe (~9.23s, 4 measures)."""
    bpm = 104.0
    beat = 60.0 / bpm
    bar = beat * 4.0
    total_dur = bar * 4.0 # 4 bars

    synth = Synth(total_dur)

    # Chords: Cmaj - Am - F - G
    chords = [
        ['C4', 'E4', 'G4', 'B4'],
        ['A3', 'C4', 'E4', 'G4'],
        ['F3', 'A3', 'C4', 'E4'],
        ['G3', 'B3', 'D4', 'F4']
    ]

    # Bass roots
    bass_roots = ['C2', 'A1', 'F1', 'G1']

    # Beat percussion
    for b in range(16):
        t = b * beat
        synth.add_hihat(t, volume=0.06)
        synth.add_hihat(t + beat * 0.5, volume=0.05)
        if b % 2 == 0:
            synth.add_kick(t, volume=0.28)
        else:
            synth.add_snare(t, volume=0.18)

    # Bassline & Arpeggios
    for bar_idx in range(4):
        bar_t = bar_idx * bar
        root = bass_roots[bar_idx]
        chord = chords[bar_idx]

        # Triangle bass groove
        synth.add_triangle(bar_t, beat * 0.8, note_to_freq(root), volume=0.3, release=0.1)
        synth.add_triangle(bar_t + beat * 1.5, beat * 0.4, note_to_freq(root) * 1.5, volume=0.22, release=0.05)
        synth.add_triangle(bar_t + beat * 2.0, beat * 0.7, note_to_freq(root), volume=0.28, release=0.1)
        synth.add_triangle(bar_t + beat * 3.25, beat * 0.5, note_to_freq(root) * 2.0, volume=0.22, release=0.08)

        # Pulse Arp (16th notes)
        for i in range(16):
            note = chord[i % len(chord)]
            t = bar_t + i * (beat / 4.0)
            synth.add_square(t, beat / 4.0 * 0.6, note_to_freq(note), duty=0.25, volume=0.07, attack=0.005, release=0.02)

    # Catchy Lead Melody (Square wave 50% duty with bounce)
    melody = [
        (0.0, 0.5, 'E5'), (0.5, 0.5, 'G5'), (1.0, 1.0, 'A5'), (2.0, 0.5, 'G5'), (2.5, 1.5, 'E5'),
        (4.0, 0.5, 'C5'), (4.5, 0.5, 'D5'), (5.0, 0.75, 'E5'), (5.75, 0.25, 'D5'), (6.0, 2.0, 'C5'),
        (8.0, 0.5, 'A4'), (8.5, 0.5, 'C5'), (9.0, 0.75, 'D5'), (9.75, 0.25, 'E5'), (10.0, 1.5, 'D5'),
        (12.0, 0.5, 'G5'), (12.5, 0.5, 'E5'), (13.0, 0.5, 'D5'), (13.5, 0.5, 'C5'), (14.0, 1.8, 'D5'),
    ]
    for start_beat, dur_beats, note in melody:
        t = start_beat * beat
        synth.add_square(t, dur_beats * beat * 0.88, note_to_freq(note), duty=0.5, volume=0.16, attack=0.01, release=0.04)

    return synth


def generate_gameplay():
    """Generates 136 BPM 'Crunch Mode' arcade chiptune (~14.12s, 8 measures)."""
    bpm = 136.0
    beat = 60.0 / bpm
    bar = beat * 4.0
    total_dur = bar * 8.0 # 8 bars loop

    synth = Synth(total_dur)

    # Chords progression (Dm - Bb - C - Am | Dm - Bb - Gm - A)
    chords_root = ['D', 'A#', 'C', 'A', 'D', 'A#', 'G', 'A']
    octaves = [2, 1, 2, 1, 2, 1, 1, 1]

    # Driving Four-on-the-floor Kick + Offbeat Hihats + Snare on 2 & 4
    for b in range(32):
        t = b * beat
        synth.add_kick(t, volume=0.32)
        synth.add_hihat(t + beat * 0.5, volume=0.09)
        if b % 2 == 1:
            synth.add_snare(t, volume=0.24)
        if b % 4 == 0:
            synth.add_hihat(t, volume=0.07)

    # 16th note pumping bassline
    for bar_idx in range(8):
        bar_t = bar_idx * bar
        root_note = f"{chords_root[bar_idx]}{octaves[bar_idx]}"
        freq = note_to_freq(root_note)

        for s in range(16):
            t = bar_t + s * (beat / 4.0)
            # Octave jump on odd 16ths
            f = freq * 2.0 if s % 2 == 1 else freq
            synth.add_triangle(t, (beat / 4.0) * 0.75, f, volume=0.28, attack=0.005, release=0.02)

    # Fast Arpeggios (Chiptune shimmer)
    arp_patterns = [
        ['D4', 'F4', 'A4', 'D5'],
        ['A#3', 'D4', 'F4', 'A#4'],
        ['C4', 'E4', 'G4', 'C5'],
        ['A3', 'C#4', 'E4', 'A4'],
        ['D4', 'F4', 'A4', 'D5'],
        ['A#3', 'D4', 'F4', 'A#4'],
        ['G3', 'A#3', 'D4', 'G4'],
        ['A3', 'C#4', 'E4', 'A4'],
    ]
    for bar_idx in range(8):
        bar_t = bar_idx * bar
        arp = arp_patterns[bar_idx]
        for s in range(16):
            t = bar_t + s * (beat / 4.0)
            note = arp[s % len(arp)]
            synth.add_square(t, (beat / 4.0) * 0.55, note_to_freq(note), duty=0.25, volume=0.09, attack=0.003, release=0.015)

    # Driving Lead Melody (Panicked, energetic square wave lead)
    # 8-bar melodic phrase
    lead = [
        # Bar 1-2
        (0.0, 0.75, 'D5'), (0.75, 0.25, 'E5'), (1.0, 0.5, 'F5'), (1.5, 0.5, 'A5'), (2.0, 1.0, 'G5'), (3.0, 1.0, 'F5'),
        (4.0, 0.5, 'E5'), (4.5, 0.5, 'F5'), (5.0, 1.0, 'G5'), (6.0, 0.5, 'A5'), (6.5, 0.5, 'G5'), (7.0, 1.0, 'E5'),
        # Bar 3-4
        (8.0, 0.75, 'F5'), (8.75, 0.25, 'G5'), (9.0, 0.5, 'A5'), (9.5, 0.5, 'C6'), (10.0, 1.0, 'A#5'), (11.0, 1.0, 'A5'),
        (12.0, 0.5, 'G5'), (12.5, 0.5, 'A5'), (13.0, 0.5, 'F5'), (13.5, 0.5, 'E5'), (14.0, 1.8, 'D5'),
        # Bar 5-6 (Rising tension)
        (16.0, 0.5, 'D5'), (16.5, 0.5, 'D5'), (17.0, 0.5, 'F5'), (17.5, 0.5, 'A5'), (18.0, 0.5, 'D6'), (18.5, 0.5, 'C6'), (19.0, 1.0, 'A#5'),
        (20.0, 0.5, 'A#5'), (20.5, 0.5, 'A#5'), (21.0, 0.5, 'D6'), (21.5, 0.5, 'C6'), (22.0, 0.5, 'A#5'), (22.5, 0.5, 'A5'), (23.0, 1.0, 'G5'),
        # Bar 7-8 (Peak countdown rush)
        (24.0, 0.25, 'G5'), (24.25, 0.25, 'A5'), (24.5, 0.25, 'A#5'), (24.75, 0.25, 'C6'),
        (25.0, 0.5, 'D6'), (25.5, 0.5, 'C6'), (26.0, 0.5, 'A#5'), (26.5, 0.5, 'A5'),
        (27.0, 0.5, 'G5'), (27.5, 0.5, 'F5'), (28.0, 0.5, 'E5'), (28.5, 0.5, 'F5'),
        (29.0, 0.5, 'G5'), (29.5, 0.5, 'A5'), (30.0, 1.5, 'D5')
    ]
    for start_beat, dur_beats, note in lead:
        t = start_beat * beat
        synth.add_square(t, dur_beats * beat * 0.9, note_to_freq(note), duty=0.5, volume=0.17, attack=0.005, release=0.03)

    return synth


def generate_victory():
    """Triumphant 8-bit fanfare stinger (~4.8s)."""
    synth = Synth(4.8)

    # Ascending intro fanfare arpeggio
    notes = ['C4', 'E4', 'G4', 'C5', 'E5', 'G5']
    for i, note in enumerate(notes):
        synth.add_square(i * 0.08, 0.12, note_to_freq(note), duty=0.5, volume=0.18, attack=0.005, release=0.02)
        synth.add_hihat(i * 0.08, volume=0.08)

    # Main triumphant fanfare melody
    fanfare = [
        (0.55, 0.2, 'C5'), (0.75, 0.2, 'C5'), (0.95, 0.2, 'C5'),
        (1.15, 0.55, 'G5'), (1.70, 0.45, 'E5'),
        (2.15, 0.2, 'C5'), (2.35, 0.2, 'E5'), (2.55, 0.2, 'G5'),
        (2.75, 1.4, 'C6')
    ]
    for t, d, note in fanfare:
        synth.add_square(t, d * 0.92, note_to_freq(note), duty=0.5, volume=0.24, attack=0.01, release=0.04)
        # Harmony 3rd below
        synth.add_square(t, d * 0.92, note_to_freq(note) * 0.8, duty=0.25, volume=0.14, attack=0.01, release=0.04)

    # Triumphant bass & drums
    synth.add_kick(0.55, volume=0.35)
    synth.add_snare(1.15, volume=0.25)
    synth.add_kick(1.70, volume=0.30)
    synth.add_snare(2.15, volume=0.20)
    synth.add_snare(2.35, volume=0.20)
    synth.add_snare(2.55, volume=0.22)
    synth.add_kick(2.75, volume=0.40)
    synth.add_snare(2.75, volume=0.30)

    # Sustained bass note under final chord
    synth.add_triangle(2.75, 1.6, note_to_freq('C2'), volume=0.35, attack=0.02, release=0.3)
    synth.add_triangle(2.75, 1.6, note_to_freq('G2'), volume=0.25, attack=0.02, release=0.3)

    return synth


def generate_gameover():
    """Satirical 'Design Crime' comedic fail stinger (~3.8s)."""
    synth = Synth(3.8)

    # Classic sad descending motif with sliding pitch
    # Wah-wah slide
    steps = [('G4', 0.0, 0.4), ('F#4', 0.45, 0.4), ('F4', 0.9, 0.4)]
    for note, t, d in steps:
        synth.add_square(t, d, note_to_freq(note), duty=0.5, volume=0.2, attack=0.02, release=0.05)
        synth.add_triangle(t, d, note_to_freq(note) * 0.5, volume=0.2, attack=0.02, release=0.05)

    # Sliding fall down to low dissonant buzz
    slide_start = 1.4
    slide_dur = 0.8
    num_slide_samples = int(slide_dur * SAMPLE_RATE)
    start_idx = int(slide_start * SAMPLE_RATE)

    for i in range(num_slide_samples):
        progress = i / num_slide_samples
        f = 280.0 * (1.0 - progress * 0.65) # drops from 280Hz to ~100Hz
        t = i / SAMPLE_RATE
        val = 1.0 if math.sin(2 * math.pi * f * t) > 0 else -1.0
        env = (1.0 - progress * 0.5)
        synth.buffer[start_idx + i] += val * env * 0.22

    # Final "Bzzzt" crime buzzer punch at 2.3s
    buzz_start = 2.25
    synth.add_triangle(buzz_start, 0.9, 65.0, volume=0.35, attack=0.01, release=0.2)
    synth.add_square(buzz_start, 0.9, 82.4, duty=0.125, volume=0.28, attack=0.01, release=0.2)
    synth.add_noise(buzz_start, 0.2, volume=0.2, decay=0.08)

    return synth


def main():
    out_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
    os.makedirs(out_dir, exist_ok=True)

    print("Generating menu soundtrack...")
    menu = generate_menu()
    menu.write_wav(os.path.join(out_dir, 'menu.wav'))

    print("Generating gameplay soundtrack...")
    gameplay = generate_gameplay()
    gameplay.write_wav(os.path.join(out_dir, 'gameplay.wav'))

    print("Generating victory soundtrack...")
    victory = generate_victory()
    victory.write_wav(os.path.join(out_dir, 'victory.wav'))

    print("Generating gameover soundtrack...")
    gameover = generate_gameover()
    gameover.write_wav(os.path.join(out_dir, 'gameover.wav'))

    print("Done generating all demo soundtracks!")

if __name__ == '__main__':
    main()
