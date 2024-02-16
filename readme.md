# React PDF Tailwind

Use Tailwind CSS to style PDFs created with [react-pdf](https://github.com/diegomura/react-pdf).

[Try it yourself](https://react-pdf-repl.vercel.app/?cp_code=JYWwDg9gTgLgBAbzgEQgYwK4gKYDsYA0cACgIYDm2RAKtgB6FwBqw2A7nAL5wBmUEIOACIAAlGyk0MALRgAJjwD043HOzioQgNwAoUJFiI4acaRjZqHbnwHDTU2QukxSwADZtgq7Tp1oIuADO8DAcALzGpuaWABQIOnBwMAAW2DgAXIgJiXD05qqZ8Tk5_m7QgYXZxYmYwQKZQv5QuDxlbOoARm4Y2EIEVTmc_cVD2aOcAJS6OvQG8Go8pBhu8DwYuFLAAXAAgmBgMRNZieIwGM1wMQMAPKiYOPgAfAOJ12SUcIHAAF7YYUI7AAsQk-MAAnm4_ghQjEhGBpIDeJC6Ej6NJ-BxWmi2FBSGA4OQ8QihBNOM9qjkEABtAB0dJ2UFxYJiAEYAEwTAC6NJAeJiMQA-kRgEcwo9Li9qtcWOxJRSANbYMFhBDAThy6rBCFQmFCLF0aQsuAgLzSNjSKlsgAMVrAME5cHhiP10lKcA65GkXR6hptJPVFIpOLxKsWbkC2ADgcS5OjOWutAYoO1Kt15gY0jZdDcvACMg6EDcciSeVdGDqIH9sbjOQAythNttVXAANRwFlRmvXRSJmDVuMJvLJyGptiw9MyQKV0n9msAGWgaTgwDAgSwcDkhegn2A8FIOEY_iCDfMZygcFIchXwECaC85Fybl3NLgADllm5SBqKRHwOpcjwPDAHeZ5wE-HTqBAy64GBpCLtgMAvvWxbAJIyw3kQvLkLgpCfOWd5gLu37VGAn5oOoZjGAIIAQJuRBQDe5ZJOchGBEkXh3nI6zwE-5DLKQRCSLkGA3jRxYAFbljAEDEcUv7LsWDFroEL7vm4n6CNgIlTrRcAAG7YMEwAdMs66QhAmGFk-bG8nQoBMYEeKsLgsk5N0UhMV4L4sHp-5MbykJrpeuF6csYAYC45hwNAOHiC-ACySxKXAEUXmg9yOS5NbFDw2DWd5wC-SATF4KAKXNAJKUrAx5FsVpuT8GxkhEB0xl4FxggGckwH8a5iSQSpJC4oZeDwCua6CNAd6WYFMCsASuJ6cAci4TASlzQAjj0F6MCthEmYEfX6bupDYLkwQvsQySkBG6lMZCHlsbgH6VUeEZbZR9UmiljDmOA5ZHeFbhLbFcC4NgW3YDSrndr2s5SooMpsPDiQTKSkrdu82D9t2dxYKNsZTDo6pAA&modules=true) in the `react-pdf-repl` interactive playground.

## Example

```jsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

// The 'theme' object is your Tailwind theme config
const tw = createTw({
  theme: {
    fontFamily: {
      sans: ["Comic Sans"],
    },
    extend: {
      colors: {
        custom: "#bada55",
      },
    },
  },
});

export default function MyPdf() {
  return (
    <Document>
      <Page size="A4" style={tw("p-12 font-sans")}>
        <View style={tw("p-20 bg-gray-100")}>
          <Text style={tw("text-custom text-3xl")}>Section #1</Text>
        </View>
        <View style={tw("mt-12 px-8 rotate-2")}>
          <Text style={tw("text-amber-600 text-2xl")}>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
}
```

More detailed examples can be found in the [examples](https://github.com/aanckar/react-pdf-tailwind/tree/main/examples) folder.

## Installation

```js
// Or pnpm, yarn...
npm install react-pdf-tailwind
```

## Notes

- Supports most of the CSS properties that make sense in a PDF context, and are supported by `react-pdf` (see [this list](https://react-pdf.org/styling#valid-css-properties))
- Default font family classes are excluded, since you have to [include your own fonts anyway](https://react-pdf.org/fonts)
- Internally uses `pt` as the default unit (supported units can be found [here](https://react-pdf.org/styling#valid-units)), using the default convention `1rem = 12pt`. If you wish to adjust this value, you can do so by providing a second parameter in the `createTw` function and specifying your desired `ptPerRem` value:
  ```jsx
  const tw = createTw({ theme: { // ...
    }}, { ptPerRem: 16 });
  ````
- Since `react-pdf` uses [Yoga](https://yogalayout.com/) internally, some defaults differ from the web standard (for example, `flex-direction` defaults to `column`, which can be fixed by adding the `flex-row` class where needed)
- Modifiers like breakpoints (which could technically make sense) aren't supported yet
