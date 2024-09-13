import { useAtom } from 'jotai';
import { EyePatternPaddingAtom } from '../../../states';
import { NumberOptionPreview } from '../../number-option-preview';
import { SelectorSection } from '../selector-section';
import React from 'react';

export const EyePatternPaddingSelector = React.memo(() => {
  const [eyePatternPadding, setEyePatternPadding] = useAtom(
    EyePatternPaddingAtom
  );
  return (
    <SelectorSection
      label="Eye Pattern Padding"
      customContent={
        <NumberOptionPreview
          // style={listStyle}
          max={4}
          min={0}
          value={eyePatternPadding}
          onChange={setEyePatternPadding}
        />
      }
    />
  );
});
