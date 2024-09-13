import { useAtom } from 'jotai';
import { NumberOptionPreview } from '../../number-option-preview';
import { SelectorSection } from '../selector-section';
import { BaseGapAtom } from '../../../states';
import React from 'react';

export const BasePaddingSelector = React.memo(() => {
  const [baseGap, setBaseGap] = useAtom(BaseGapAtom);
  return (
    <SelectorSection
      label="Base Padding"
      customContent={
        <NumberOptionPreview
          max={4}
          min={0}
          value={baseGap}
          onChange={setBaseGap}
        />
      }
    />
  );
});
