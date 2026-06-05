import { definePreset, palette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const Preset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eef4fd',
      100: '#d7e4fa',
      200: '#b3cdf5',
      300: '#8eb6ef',
      400: '#6a9fe8',
      500: '#4884df',
      600: '#3a6ec0',
      700: '#2d58a0',
      800: '#204280',
      900: '#152d60'
    },

    surface: {
      0:   '#e7e9f8',
      50:  '#dcdef3',
      100: '#c2c7ea',
      200: '#aab1df',
      300: '#929bd2',
      400: '#7a85c3',
      500: '#6470b1',
      600: '#566096',
      700: '#474e75',
      800: '#383c57',
      900: '#313446'
    },

    zinc: {
      0:   '#e7e9f8',
      50:  '#e3e5f0',
      100: '#c4c8de',
      200: '#aaafcd',
      300: '#8d94b9',
      400: '#747da6',
      500: '#5c6489',
      600: '#494f6a',
      700: '#34384c',
      800: '#222533',
      900: '#191b25'
    }
  },
});

export default Preset;
