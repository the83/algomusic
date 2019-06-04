import React from 'react';
import {
  // Loop,
  CrossFade,
  Transport,
  MonoSynth,
  BasicOscillatorType,
  FilterType,
  Part,
} from 'tone';

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

export default class Composition extends React.Component<IProps, IState> {
  startAudio(): void {
    Transport.start();

    const synth1 = buildMonoSynth();
    const synth2 = buildMonoSynth();

    const crossFade = new CrossFade(0.5);
    synth1.connect(crossFade, 0, 0);
    synth2.connect(crossFade, 0, 1);
    crossFade.fade.value = 0.5;

    const part = new Part(
      function(time, value){
        synth1.triggerAttackRelease(value.note, "8n", time, value.velocity);
      },
      [
        { time: '1:1', note: 'C3', velocity: 0.2 },
        { time: '1:2', note: 'E3', velocity: 0.2 },
        { time: '1:3', note: 'G3', velocity: 0.2 },
        { time: '1:4', note: 'C4', velocity: 0.2 },
      ],
    );

    part.loop = true;
    part.start(0);

    // const part2 = new Part(
      // function(time, value){
        // synth2.triggerAttackRelease(value.note, "8n", time, value.velocity);
      // },
      // [
        // { time: 0, note: 'E3', velocity: 0.2 },
        // { time: '0:1:2', note: 'G3', velocity: 0.2 },
        // { time: '0:2:3', note: 'E4', velocity: 0.2 },
        // { time: '0:3', note: 'E4', "velocity": 0.2 },
      // ],
    // );

    // part2.loop = true;
    // part2.start(0);

    // play a note with the synth we setup
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
