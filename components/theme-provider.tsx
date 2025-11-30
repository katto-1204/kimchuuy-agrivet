'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Provide safe defaults to avoid SSR/CSR hydration mismatches:
  // - attribute="class" so theme toggles add/remove `.dark` on <html> or <body>
  // - defaultTheme="light" to keep server and client initial markup consistent
  // - enableSystem=false to avoid using system preference during SSR
  const defaults: Partial<ThemeProviderProps> = {
    attribute: 'class',
    defaultTheme: 'light',
    enableSystem: false,
    enableColorScheme: false,
  }

  return (
    <NextThemesProvider {...defaults} {...props}>
      {children}
    </NextThemesProvider>
  )
}
