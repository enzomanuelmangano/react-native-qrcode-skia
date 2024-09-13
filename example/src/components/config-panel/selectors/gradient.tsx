import { useAtom } from 'jotai';
import { GradientTypeOptions, SelectedGradientAtom } from '../../../states';
import { GradientOptionPreview } from '../../gradient-option-preview';
import { SelectorSection } from '../selector-section';
import React from 'react';

export const GradientSelector = React.memo(() => {
  const [gradientType, setGradientType] = useAtom(SelectedGradientAtom);
  return (
    <SelectorSection
      label="Gradient"
      data={GradientTypeOptions}
      renderItem={(gradient) => (
        <GradientOptionPreview
          type={gradient}
          onPress={() => setGradientType(gradient)}
          isActive={gradientType === gradient}
        />
      )}
    />
  );
});
