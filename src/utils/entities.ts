import type { ColorTokens } from '../types';

// Dark glassy per-bin backgrounds + accent colours. Includes a few category
// aliases (garden/plastic/paper/recycling/gray) so users can type a bin's
// category instead of memorizing a colour name.
export const COLOR_MAP: Record<string, ColorTokens> = {
  grey:      { bg: 'rgba(42,45,49,0.92)',  accent: '#9e9e9e' , glow: 'rgba(158,158,158,0.15)' },
  gray:      { bg: 'rgba(42,45,49,0.92)',  accent: '#9e9e9e' , glow: 'rgba(158,158,158,0.15)' },
  green:     { bg: 'rgba(30,50,33,0.92)',  accent: '#72e906' , glow: 'rgba(114,233,6,0.12)'   },
  garden:    { bg: 'rgba(30,50,33,0.92)',  accent: '#72e906' , glow: 'rgba(114,233,6,0.12)'   },
  burgundy:  { bg: 'rgba(54,28,40,0.92)',  accent: '#c04070' , glow: 'rgba(192,64,112,0.14)'  },
  plastic:   { bg: 'rgba(54,28,40,0.92)',  accent: '#c04070' , glow: 'rgba(192,64,112,0.14)'  },
  beige:     { bg: 'rgba(52,48,35,0.92)',  accent: '#d4a843' , glow: 'rgba(212,168,67,0.13)'  },
  paper:     { bg: 'rgba(52,48,35,0.92)',  accent: '#d4a843' , glow: 'rgba(212,168,67,0.13)'  },
  recycling: { bg: 'rgba(52,48,35,0.92)',  accent: '#d4a843' , glow: 'rgba(212,168,67,0.13)'  },
  blue:      { bg: 'rgba(25,40,65,0.92)',  accent: '#4fc3f7' , glow: 'rgba(79,195,247,0.13)'  },
  brown:     { bg: 'rgba(50,33,20,0.92)',  accent: '#a1887f' , glow: 'rgba(161,136,127,0.13)' },
  black:     { bg: 'rgba(20,20,20,0.92)',  accent: '#616161' , glow: 'rgba(97,97,97,0.13)'    },
  red:       { bg: 'rgba(60,20,20,0.92)',  accent: '#ef5350' , glow: 'rgba(239,83,80,0.13)'   },
  yellow:    { bg: 'rgba(55,50,15,0.92)',  accent: '#ffee58' , glow: 'rgba(255,238,88,0.12)'  },
  purple:    { bg: 'rgba(40,20,55,0.92)',  accent: '#ab47bc' , glow: 'rgba(171,71,188,0.13)'  },
  orange:    { bg: 'rgba(55,38,15,0.92)',  accent: '#ffa726' , glow: 'rgba(255,167,38,0.13)'  },
  pink:      { bg: 'rgba(60,25,45,0.92)',  accent: '#f48fb1' , glow: 'rgba(244,143,177,0.12)' },
  silver:    { bg: 'rgba(50,52,55,0.92)',  accent: '#b0bec5' , glow: 'rgba(176,190,197,0.12)' },
  amber:     { bg: 'rgba(55,44,10,0.92)',  accent: '#ffca28' , glow: 'rgba(255,202,40,0.13)'  },
  teal:      { bg: 'rgba(15,45,42,0.92)',  accent: '#26a69a' , glow: 'rgba(38,166,154,0.13)'  },
  navy:      { bg: 'rgba(10,20,50,0.92)',  accent: '#3949ab' , glow: 'rgba(57,73,171,0.14)'   },
  lime:      { bg: 'rgba(35,50,10,0.92)',  accent: '#d4e157' , glow: 'rgba(212,225,87,0.12)'  },
  white:     { bg: 'rgba(55,58,62,0.92)',  accent: '#eceff1' , glow: 'rgba(236,239,241,0.10)' },
  default:   { bg: 'rgba(38,40,44,0.92)',  accent: '#90caf9' , glow: 'rgba(144,202,249,0.12)' },
};

// Primary colour names only (no aliases) — used by the editor's swatch picker.
export const PRIMARY_COLORS = [
  'grey', 'green', 'burgundy', 'beige', 'blue', 'brown', 'black', 'red',
  'yellow', 'purple', 'orange', 'pink', 'silver', 'amber', 'teal', 'navy',
  'lime', 'white',
];

export function colorFor(color: string | undefined): ColorTokens {
  return COLOR_MAP[(color ?? '').toLowerCase()] ?? COLOR_MAP.default;
}
