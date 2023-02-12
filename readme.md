# React PDF Tailwind

Use Tailwind CSS to style PDFs created with [react-pdf](https://github.com/diegomura/react-pdf).

## Example

```jsx
import React from "react";
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

- Supports most of the CSS properties that make sense in a PDF context, and are supported by react-pdf (see [this list](https://react-pdf.org/styling#valid-css-properties))
- Default font family classes are excluded, since you have to [include your own fonts anyway](https://react-pdf.org/fonts)
- Internally uses `pt` as the default unit (supported units can be found [here](https://react-pdf.org/styling#valid-units)), using the convention `1rem = 12pt`
- Since `react-pdf` uses [Yoga](https://yogalayout.com/) internally, some defaults differ from the web standard (for example, `flex-direction` defaults to `column`, which can be fixed by adding the `flex-row` class where needed)
- Modifiers like breakpoints (which could technically make sense) aren't supported yet
