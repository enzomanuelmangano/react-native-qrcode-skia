import { useAtom } from 'jotai';
import { EyePatternGapAtom } from '../../../states';
import { NumberOptionPreview } from '../../number-option-preview';
import { SelectorSection } from '../selector-section';
import React from 'react';

export const EyePatternPaddingSelector = React.memo(() => {
  const [eyePatternPadding, setEyePatternPadding] = useAtom(EyePatternGapAtom);
  return (
    <SelectorSection
      label="Eye Pattern Gap"
      customContent={
        <NumberOptionPreview
          max={4}
          min={0}
          value={eyePatternPadding}
          onChange={setEyePatternPadding}
        />
      }
    />
  );
});
