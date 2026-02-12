import { useSelector } from '@legendapp/state/react';
import { qrcodeState$ } from '../../../states';
import { NumberOptionPreview } from '../../number-option-preview';
import { SelectorSection } from '../selector-section';
import React from 'react';

export const EyePatternPaddingSelector = React.memo(() => {
  const eyePatternPadding = useSelector(qrcodeState$.eyePatternGap);
  return (
    <SelectorSection
      label="Eye Pattern Gap"
      customContent={
        <NumberOptionPreview
          max={4}
          min={0}
          value={eyePatternPadding}
          onChange={(value) => qrcodeState$.eyePatternGap.set(value)}
        />
      }
    />
  );
});
