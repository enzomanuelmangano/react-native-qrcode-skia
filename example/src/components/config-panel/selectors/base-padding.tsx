import { useAtom } from 'jotai';
import { NumberOptionPreview } from '../../number-option-preview';
import { SelectorSection } from '../selector-section';
import { BasePaddingAtom } from '../../../states';
import React from 'react';

export const BasePaddingSelector = React.memo(() => {
  const [basePadding, setBasePadding] = useAtom(BasePaddingAtom);
  return (
    <SelectorSection
      label="Base Padding"
      customContent={
        <NumberOptionPreview
          max={4}
          min={0}
          value={basePadding}
          onChange={setBasePadding}
        />
      }
    />
  );
});
