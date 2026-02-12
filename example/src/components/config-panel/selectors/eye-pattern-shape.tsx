import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, Shapes } from '../../../states';
import React from 'react';
import { SelectorSection } from '../selector-section';
import { ShapeOptionPreview } from '../../shape-option-preview';

export const EyePatternShapeSelector = React.memo(() => {
  const eyePatternShape = useSelector(qrcodeState$.eyePatternShape);
  return (
    <SelectorSection
      label="Eye Pattern Shapes"
      data={Shapes}
      renderItem={(shape) => (
        <ShapeOptionPreview
          shape={shape}
          isActive={eyePatternShape === shape}
          onPress={() => qrcodeState$.eyePatternShape.set(shape)}
        />
      )}
    />
  );
});
