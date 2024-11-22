import '@mui/material/styles';
import '@mui/material/Button';
import '@mui/material/AppBar';

export declare module '@mui/material/styles' {
  export declare interface Palette {
    sky: Palette['primary'];
  }
  export declare interface PaletteOptions {
    sky?: PaletteOptions['primary'];
  }
}

export declare module '@mui/material/Button' {
  export interface ButtonPropsColorOverrides {
    sky: true;
  }
}

export declare module '@mui/material/AppBar' {
  export interface AppBarPropsColorOverrides {
    sky: true;
  }
}

// TypeScript가 새로운 네임스페이스를 인식할 수 있도록 빈 export 추가
