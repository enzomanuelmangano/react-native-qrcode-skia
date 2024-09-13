import { useAtom } from 'jotai';
import { EyePatternShapeAtom, Shapes } from '../../../states';
import React from 'react';
import { SelectorSection } from '../selector-section';
import { ShapeOptionPreview } from '../../shape-option-preview';

export const EyePatternShapeSelector = React.memo(() => {
  const [eyePatternShape, setEyePatternShape] = useAtom(EyePatternShapeAtom);
  return (
    <SelectorSection
      label="Eye Pattern Shapes"
      data={Shapes}
      renderItem={(shape) => (
        <ShapeOptionPreview
          shape={shape}
          isActive={eyePatternShape === shape}
          onPress={() => setEyePatternShape(shape)}
        />
      )}
    />
  );
});
