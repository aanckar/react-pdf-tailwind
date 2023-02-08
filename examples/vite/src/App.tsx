import { PDFViewer, Document, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "../../../dist";

const tw = createTw({
  theme: {
    extend: {
      colors: {
        custom: "cornflowerblue",
      },
    },
  },
});

export default function App() {
  return (
    <main>
      <PDFViewer width="100%" height="650px">
        <Document>
          <Page size="A4" style={tw("p-4 flex flex-row flex-wrap gap-4")}>
            {[...Array(12)].map((_, i) => (
              <View
                key={i}
                style={tw("flex-1 min-w-[200pt] p-4 bg-blue-100")}
                wrap={false}
              >
                <Text style={tw("block text-2xl font-bold text-custom")}>
                  Section {i + 1}
                </Text>
                <Text style={tw("text-sm")}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                  semper efficitur libero in laoreet. Sed iaculis, magna
                  suscipit placerat commodo, risus turpis tincidunt ligula, ac
                  euismod justo sem id risus. Nullam euismod vestibulum leo,
                  mollis maximus sapien luctus in. Vivamus malesuada vulputate
                  ornare. Mauris ut accumsan felis. Vivamus enim urna, ultrices
                  eu eros ac, bibendum vehicula eros. Praesent ipsum orci,
                  molestie gravida tristique at, dapibus vitae est. Phasellus
                  lectus nulla, consequat eu mi ut, tempus pulvinar neque.
                </Text>
              </View>
            ))}
          </Page>
        </Document>
      </PDFViewer>
    </main>
  );
}
