import { useSelector } from '@legendapp/state/react';
import { NumberOptionPreview } from '../../number-option-preview';
import { SelectorSection } from '../selector-section';
import { qrcodeState$ } from '../../../states';
import React from 'react';

export const BasePaddingSelector = React.memo(() => {
  const baseGap = useSelector(qrcodeState$.baseGap);
  return (
    <SelectorSection
      label="Base Padding"
      customContent={
        <NumberOptionPreview
          max={4}
          min={0}
          value={baseGap}
          onChange={(value) => qrcodeState$.baseGap.set(value)}
        />
      }
    />
  );
});
