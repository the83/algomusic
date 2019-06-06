import React from 'react';
import {
  // Loop,
  PanVol,
  Transport,
  MonoSynth,
  BasicOscillatorType,
  FilterType,
  Part,
} from 'tone';

import {
  flatten,
  isUndefined,
  last,
  random,
  sample,
  times,
} from 'lodash';

interface IProps {
}

interface IState {
}

function buildMonoSynth(overrides = {}) {
  const options = {
    oscillator: {
      type: 'sine' as BasicOscillatorType,
    },
    filter  : {
      Q: 6,
      type: 'lowpass' as FilterType,
      rollof: -24,
    },
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 0.1,
      release: 0.1,
    },
  };

  return new MonoSynth({
    ...options,
    ...overrides,
  }).toMaster();
}

function makeChannel(instrument: any): void {
  const channel = new PanVol(0, 0.5).toMaster();
  instrument.chain(channel);
}

function generateSubdivision(
  offset: string,
  chooseNote: Function,
) {
  const numNotes = random(0, 4);
  if (numNotes === 0) return [];

  const timings: number[] = [];

  for (let i = 0; i < numNotes; i++) {
    const lastTiming = last(timings);
    const notesRemaining = 4 - numNotes;

    const min = isUndefined(lastTiming) ? 0 : lastTiming + 1;
    const max = min + notesRemaining < 3 ? min + notesRemaining : min;

    timings.push(random(min, max));
  }

  return timings.map((i) => {
    return [`${offset}:${i}`, chooseNote()]
  });
}

function pickNote(): string {
  return sample(['C4', 'E3', 'G3', 'C4']) as string;
}

function generatePattern(length = 0) {
  return flatten(times(length, (i) => {
    const subdivisions: any[] = [];
    return subdivisions.concat(generateSubdivision(`${i}.0`, pickNote))
      .concat(generateSubdivision(`${i}.1`, pickNote))
      .concat(generateSubdivision(`${i}.2`, pickNote))
      .concat(generateSubdivision(`${i}.3`, pickNote))
  }));
}

function generatePart(length: number, action: any, loopLength: number) {
  const pattern = generatePattern(length);
  const part = new Part(action, pattern);
  part.loopEnd = length;
  part.loop = loopLength;
  return part;
}

export default class Composition extends React.Component<IProps, IState> {
  startAudio(): void {
    Transport.start();

    const synth1 = buildMonoSynth();
    const synth2 = buildMonoSynth();

		makeChannel(synth1);
		makeChannel(synth2);

    function synth1Action(time: any, note: string) {
      synth1.triggerAttackRelease(note, '8n', time);
    }

    const part1 = generatePart(3, synth1Action, 2);
    part1.start(0);

    function synth2Action(time: any, note: string) {
      synth2.triggerAttackRelease(note, '8n', time);
    }

    const part2 = generatePart(1, synth2Action, 10);
    part2.start(0);
  }

  render() {
    return (
      <div>
        <button onClick={this.startAudio}>
          Play
        </button>
      </div>
    );
  }
}
