import React, { useState, useEffect } from 'react';
import { Flex } from 'rebass';

import { useTone } from 'audio/contexts/ToneContext';
import { INSTRUMENT_PRESETS, initializeInstruments, createInstrumentFromPreset, generateScale } from 'audio';

import { MainLayout } from 'layouts';
import { Button } from 'components';
import { Header, Channel } from './components';

const rotate = ([head, ...tail]) => {
  const newArr = [...tail, head];
  return newArr;
};

const INITIAL_CHANNELS = [
  // {
  //   arrangement: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  //   instrumentId: 'SynthSine',
  //   note: { root: 'C4', length: '8n' }
  // },
  {
    arrangement: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    instrumentId: 'MembraneLow',
    note: { root: 'C1', length: '16n' },
  },
  {
    arrangement: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    instrumentId: 'MembraneLow',
    note: { root: 'C4', length: '4n' },
  },
  {
    arrangement: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    instrumentId: 'SynthSine',
    note: { root: 'D#5', length: '16n' },
  },
  {
    arrangement: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    instrumentId: 'SynthSine',
    note: { root: 'C4', length: '8n' },
    scale: generateScale({ rootNote: 'C', octave: 4, scaleType: 'Natural Minor' }),
  },
  {
    arrangement: [0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1],
    instrumentId: 'SynthSaw',
    note: { root: 'C1', length: '8n' },
  },
];

const Root = () => {
  const Tone = useTone();
  const { Transport } = Tone;

  // Track / Instrument State
  const [channels, setChannels] = useState(INITIAL_CHANNELS);
  const [instruments, setInstruments] = useState(() => initializeInstruments({ toneJs: Tone }));

  // ToneJS-Controlled Values
  const [playing, setPlaying] = useState(false);
  const [playHeadPosition, setPlayHeadPosition] = useState(0);

  useEffect(() => console.log({ playHeadPosition }), [playHeadPosition]);

  useEffect(
    () => {
      console.log('useEffect Trigger');
      // Generates a Sequence (Loop of Events) from Tone.JS
      const sequenceLoop = new Tone.Sequence(
        (time, currentPlayStep) => {
          // Update active column for animation
          setPlayHeadPosition(currentPlayStep);

          channels.map(({ note, scale, instrumentId, arrangement }, channelIndex) => {
            // Find note-on's from each channel's arrangement, and fire instrument
            if (arrangement[currentPlayStep]) {
              const instrument = instruments[instrumentId];

              const noteTrigger = instrument.triggerAttackRelease(
                scale ? scale[currentPlayStep] : note.root,
                note.length,
                time
              );

              console.log({ noteTrigger });
              return null;
            }
            return null;
          });

          // // rotate the scale for each channel, provided the note just played
          // setChannels(channels =>
          //   channels.map(channel => {
          //     if (!channel.arrangement[currentPlayStep] || !channel.scale) {
          //       return channel;
          //     }

          //     return {
          //       ...channel,
          //       scale: rotate(channel.scale),
          //     };
          //   })
          // );
        },
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], // Values to iterate over for currentPlayStep
        '8n' // Length of time between steps
      ).start(0);
      return () => sequenceLoop.dispose(); // Callback to kill sequenceLoop
    },
    [] // Retrigger when pattern changes
  );

  const handlePlayToggle = () => {
    Transport.toggle();
    setPlaying(playing => !playing);
  };

  const handleNoteClick = ({ channelIndex, noteIndex, noteVal }) => {
    setChannels(oldChannels => {
      const newChannels = [...oldChannels];
      newChannels[channelIndex].arrangement[noteIndex] = +!noteVal;
      return newChannels;
    });
  };

  const handleMoreBlips = () => {
    const newInstrument = createInstrumentFromPreset({
      toneJs: Tone,
      presetId: INSTRUMENT_PRESETS[Math.floor(Math.random() * INSTRUMENT_PRESETS.length)].presetId,
    });
    const instrumentId = `${newInstrument.presetId}__channel_${channels.length}`;
    const randArrangement = [...Array(16)].map(() => Math.round(Math.random() - 0.2));

    const newChannel = {
      arrangement: randArrangement,
      instrumentId: instrumentId,
      note: { root: 'C4', length: '8n' },
    };

    setInstruments(oldInstruments => ({ ...oldInstruments, [instrumentId]: newInstrument }));
    setChannels(oldChannels => [...oldChannels, newChannel]);
  };

  const handleLessBlips = () => {
    setChannels(channels => {
      const oneLessBlip = [...channels];
      oneLessBlip.pop();
      return oneLessBlip;
    });
  };

  return (
    <MainLayout footer={<Header handlePlayToggle={handlePlayToggle} playing={playing} />}>
      <Flex width={1} m="0.5em" justifyContent="center" flexWrap="wrap">
        {channels.map((channel, channelIndex) => (
          <Channel
            key={`channel_${channelIndex}`}
            width={1}
            channel={channel}
            setChannels={setChannels}
            channelIndex={channelIndex}
            instrument={instruments[channel.instrumentId]}
            handleNoteClick={handleNoteClick}
            totalChannels={channels.length}
            playHeadPosition={playHeadPosition}
          />
        ))}
      </Flex>

      <Flex alignItems="center">
        {channels.length < 9 && (
          <Button m="0.5em" id="toneStart" bg={!playing ? '#08AEEA' : '#2AF598'} onClick={handleMoreBlips}>
            {!playing ? 'More Blip?' : 'Yeeeah! More Blips?'}
          </Button>
        )}

        {channels.length > 1 && (
          <Button m="0.5em" id="toneStart" bg="#e67ad4" onClick={handleLessBlips}>
            Less Blips?
          </Button>
        )}
      </Flex>
    </MainLayout>
  );
};

export { Root };
