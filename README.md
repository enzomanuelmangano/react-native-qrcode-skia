<h1 align="center">
React Native QRCode Skia 🎨
</h1>

A lightweight and high-performance QR code generator component for React Native, powered by Skia rendering engine. 

Generate your **QR Code** in less than 30 seconds using [qrcode.reactiive.io](https://qrcode.reactiive.io).

https://github.com/user-attachments/assets/ec0acc48-1204-48ed-8106-45669af96593

## Installation

Before installing the package, make sure you have installed [RN Skia](https://shopify.github.io/react-native-skia/). 

```sh
yarn add @shopify/react-native-skia
```

Then, you can install the package:

```sh
yarn add react-native-qrcode-skia
```

## Usage

You might need a very simple QRCode component in your app and you can achieve that by using the basic props (value and size). Here is an example:

```tsx
import QRCode from 'react-native-qrcode-skia';

const App = () => {
  return (
    <QRCode
      value="https://qrcode.reactiive.io"
      size={200}
    />
  );
};

export default App;
```

Under the hood, the QRCode is essentially a Skia Path. This means that customization is straightforward using the 'children' prop. Here's an example:

```tsx
import QRCode from 'react-native-qrcode-skia';

const App = () => {
  return (
    <QRCode
      value="https://qrcode.reactiive.io"
      size={200}
      shapeOptions={{
        shape: "circle",
        eyePatternShape: "rounded",
        eyePatternGap: 0,
        gap: 0
      }}
      logoAreaSize={70}
      logo={
        <View style={{
          height: 50,
          aspectRatio: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 38 }}>🦊</Text>
        </View>
      }
    >
      <RadialGradient c={{ x: 100, y: 100 }} r={100} colors={["#eeca3b","#ee3b83"]} />
    </QRCode>
  );
};

export default App;
```

## Props

- `value` (string) - The value encoded in the QRCode.

- `style` (StyleProp<ViewStyle>, optional) - The style applied to the QRCode container.

- `errorCorrectionLevel` (ErrorCorrectionLevelType, optional) - The error correction level for the QRCode. Level L: 7%, level M: 15%, level Q: 25%, level H: 30%. Default value is 'H'.

- `color` (string, optional) - The color of the QRCode base path. Default value is '#000000'.

- `strokeWidth` (number, optional) - The stroke width in pixels when pathStyle is 'stroke'. Default value is 1.

- `children` (React.ReactNode, optional) - The children components rendered within the QRCode container.

- `pathStyle` ('fill' | 'stroke', optional) - The style of the QRCode path: 'fill' or 'stroke'. Default value is 'fill'.

- `padding` (number, optional) - The padding applied around the QRCode. Default value is 0.

- `size` (number) - The size of the QRCode.

- `shapeOptions` (ShapeOptions, optional) - The shape options for the QRCode path. ShapeOptions include:
  - `shape` (BaseShapeOptions, optional) - The shape of the QR code elements. Can be 'square', 'circle', 'rounded', 'diamond', 'triangle', or 'star'. Default is 'rounded'.
  - `eyePatternShape` (BaseShapeOptions, optional) - The shape of the eye patterns. Can be 'square', 'circle', 'rounded', 'diamond', 'triangle', or 'star'. Default is 'rounded'.
  - `gap` (number, optional) - The gap between QR code elements. Default is 0.
  - `eyePatternGap` (number, optional) - The gap in the eye patterns. Default is 0.
  - `logoAreaBorderRadius` (number, optional) - The border radius of the logo area. Default is 0.

- `logoAreaSize` (number, optional) - The size of the area cleared for the logo in the center of the QR code. Default is 70 when logo is provided, 0 otherwise.

- `logo` (React.ReactNode, optional) - A React node to render as the logo in the center of the QR code. When provided, a square area is cleared in the center to make room for the logo.

## Would you like to support me?

If you like my work and want to support me, the easiest way is to subscribe to my [YouTube channel](https://www.youtube.com/@Reactiive).
This seems like an easy task, but it means a lot to me.

### Other ways to support me and get exclusive content:

- [My course (Reanimate.dev)](https://www.reanimate.dev): Are you really into animations? Fantastic! This makes two of us. Here you can access my React Native animations course and learn how to improve your animations skills.
- [Patreon](https://www.patreon.com/reactiive): Every week, since a couple of years, I've been sharing a new special animation with my Patrons. If you want to access all of them, you can become a Patron.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
