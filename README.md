<h1 align="center">
React Native QRCode Skia 🎨
</h1>

A lightweight and high-performance QR code generator component for React Native, powered by Skia rendering engine.

<div align="center">
    <img src="https://github.com/enzomanuelmangano/react-native-qrcode-skia/blob/main/.assets/react-native-qrcode-skia.png" title="react-native-qrcode-skia">
</div>


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

```tsx
import QRCode from 'react-native-qrcode-skia';

const App = () => {
  return (
    <QRCode
      value="https://patreon.com/reactiive"
      size={200}
    />
  );
};

export default App;
```

## Props

- `value` (string) - The value encoded in the QRCode.

- `style` (StyleProp<ViewStyle>, optional) - The style applied to the QRCode container.

- `errorCorrectionLevel` (ErrorCorrectionLevelType, optional) - The error correction level for the QRCode. Default value is 'H'.

- `pathColor` (string, optional) - The color of the QRCode path. Default value is '#000000'.

- `strokeWidthPercentage` (number | BaseSharedValue<number>, optional) - The percentage of the strokeWidth (0 to 1). Default value is 1.

- `children` (React.ReactNode, optional) - The children components rendered within the QRCode container.

- `pathStyle` ('fill' | 'stroke', optional) - The style of the QRCode path. Default value is 'stroke'.

- `padding` (number, optional) - The padding applied around the QRCode. Default value is 0.

- `size` (number) - The size of the QRCode.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
