import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string
      primaryDark: string
      secondary: string
      accent: string
      background: string
      surface: string
      text: {
        primary: string
        secondary: string
        light: string
      }
      border: string
      success: string
      warning: string
      error: string
    }
    typography: {
      fontFamily: {
        primary: string
        secondary: string
      }
      fontSize: {
        xs: string
        sm: string
        base: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
        '4xl': string
        '5xl': string
      }
      fontWeight: {
        light: number
        normal: number
        medium: number
        semibold: number
        bold: number
      }
    }
    spacing: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
    }
    borderRadius: {
      sm: string
      md: string
      lg: string
      xl: string
    }
    shadows: {
      sm: string
      md: string
      lg: string
    }
    breakpoints: {
      mobile: string
      tablet: string
      desktop: string
      wide: string
    }
  }
}