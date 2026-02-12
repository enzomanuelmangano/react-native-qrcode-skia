import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, Shapes } from '../../../states';
import React from 'react';
import { ShapeOptionPreview } from '../../shape-option-preview';
import { SelectorSection } from '../selector-section';

export const BaseShapeSelector = React.memo(() => {
  const baseShape = useSelector(qrcodeState$.baseShape);
  return (
    <SelectorSection
      label="Base Shape"
      data={Shapes}
      renderItem={(shape) => (
        <ShapeOptionPreview
          shape={shape}
          isActive={baseShape === shape}
          onPress={() => qrcodeState$.baseShape.set(shape)}
        />
      )}
    />
  );
});
