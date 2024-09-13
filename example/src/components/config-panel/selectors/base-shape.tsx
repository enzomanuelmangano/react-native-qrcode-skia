import { useAtom } from 'jotai';
import { BaseShapeAtom, Shapes } from '../../../states';
import React from 'react';
import { ShapeOptionPreview } from '../../shape-option-preview';
import { SelectorSection } from '../selector-section';

export const BaseShapeSelector = React.memo(() => {
  const [baseShape, setBaseShape] = useAtom(BaseShapeAtom);
  return (
    <SelectorSection
      label="Base Shape"
      data={Shapes}
      renderItem={(shape) => (
        <ShapeOptionPreview
          shape={shape}
          isActive={baseShape === shape}
          onPress={() => setBaseShape(shape)}
        />
      )}
    />
  );
});
