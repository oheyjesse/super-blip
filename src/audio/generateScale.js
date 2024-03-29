// prettier-ignore
// const MIDI_FLAT_NAMES = [
//   'C_1', 'Db_1', 'D_1', 'Eb_1', 'Fb_1', 'F_1', 'Gb_1', 'G_1', 'Ab_1', 'A_1', 'Bb_1', 'Cb0',
//   'C0', 'Db0', 'D0', 'Eb0', 'Fb0', 'F0', 'Gb0', 'G0', 'Ab0', 'A0', 'Bb0', 'Cb1',
//   'C1', 'Db1', 'D1', 'Eb1', 'Fb1', 'F1', 'Gb1', 'G1', 'Ab1', 'A1', 'Bb1', 'Cb2',
//   'C2', 'Db2', 'D2', 'Eb2', 'Fb2', 'F2', 'Gb2', 'G2', 'Ab2', 'A2', 'Bb2', 'Cb3',
//   'C3', 'Db3', 'D3', 'Eb3', 'Fb3', 'F3', 'Gb3', 'G3', 'Ab3', 'A3', 'Bb3', 'Cb4',
//   'C4', 'Db4', 'D4', 'Eb4', 'Fb4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'Cb5',
//   'C5', 'Db5', 'D5', 'Eb5', 'Fb5', 'F5', 'Gb5', 'G5', 'Ab5', 'A5', 'Bb5', 'Cb6',
//   'C6', 'Db6', 'D6', 'Eb6', 'Fb6', 'F6', 'Gb6', 'G6', 'Ab6', 'A6', 'Bb6', 'Cb7',
//   'C7', 'Db7', 'D7', 'Eb7', 'Fb7', 'F7', 'Gb7', 'G7', 'Ab7', 'A7', 'Bb7', 'Cb8',
//   'C8', 'Db8', 'D8', 'Eb8', 'Fb8', 'F8', 'Gb8', 'G8', 'Ab8', 'A8', 'Bb8', 'Cb9',
//   'C9', 'Db9', 'D9', 'Eb9', 'Fb9', 'F9', 'Gb9', 'G9'
// ];

// prettier-ignore
const MIDI_SHARP_NAMES = [
  'C_1', 'C#_1', 'D_1', 'D#_1', 'E_1', 'F_1', 'F#_1', 'G_1', 'G#_1', 'A_1', 'A#_1', 'B_1',
  'C0', 'C#0', 'D0', 'D#0', 'E0', 'F0', 'F#0', 'G0', 'G#0', 'A0', 'A#0', 'B0',
  'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',
  'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
  'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
  'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',
  'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7',
  'C8', 'C#8', 'D8', 'D#8', 'E8', 'F8', 'F#8', 'G8', 'G#8', 'A8', 'A#8', 'B8',
  'C9', 'C#9', 'D9', 'D#9', 'E9', 'F9', 'F#9', 'G9'
]

const MIDDLE_ROOT_NOTES = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  Ab: 8,
  A: 9,
  Bb: 10,
  B: 11,
  Cb: 11,
};

const INTERVALS = {
  Major: [0, 2, 4, 5, 7, 9, 11, 12],
  'Natural Minor': [0, 2, 3, 5, 7, 8, 10, 12],
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11, 12],
  'Melodic Minor': [0, 2, 3, 5, 7, 9, 11, 12],
};

// const MODES = ['major', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];

const generateScale = ({ rootNote = 'C', scaleType, octave = 5 }) => {
  const interval = INTERVALS[scaleType];

  if (interval === undefined) {
    throw new Error('generateScale: scaleType not found!');
  }

  if (MIDDLE_ROOT_NOTES[rootNote] === undefined) {
    throw new Error('generateScale: rootNote not found!');
  }

  const octaveOffset = (octave + 1) * 12;

  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
    pos => MIDI_SHARP_NAMES[octaveOffset + interval[(MIDDLE_ROOT_NOTES[rootNote] + pos) % interval.length]]
  );
};

export { generateScale };
