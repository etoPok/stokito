import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Mask, Rect } from 'react-native-svg';

type ScannerMaskProps = {
  scanSize: number;
  radius: number;
};

export default function ScannerMask({ scanSize, radius }: ScannerMaskProps) {
  const [layout, setLayout] = React.useState({ width: 0, height: 0 });
  const holeX = (layout.width - scanSize) / 2;
  const holeY = (layout.height - scanSize) / 2;

  return (
    <View
      style={StyleSheet.absoluteFill}
      onLayout={(e) => setLayout(e.nativeEvent.layout)}
    >
      <Svg height="100%" width="100%">
        <Defs>
          <Mask id="mask">
            <Rect width="100%" height="100%" fill="white" />
            <Rect
              x={holeX}
              y={holeY}
              width={scanSize}
              height={scanSize}
              rx={radius}
              ry={radius}
              fill="black"
            />
          </Mask>
        </Defs>

        <Rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.55)"
          mask="url(#mask)"
        />
      </Svg>
    </View>
  );
}
