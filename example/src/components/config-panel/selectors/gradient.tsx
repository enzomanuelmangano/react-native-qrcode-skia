import { useSelector } from '@legendapp/state/react';
import { GradientTypeOptions, qrcodeState$ } from '../../../states';
import { GradientOptionPreview } from '../../gradient-option-preview';
import { SelectorSection } from '../selector-section';
import React from 'react';

export const GradientSelector = React.memo(() => {
  const gradientType = useSelector(qrcodeState$.selectedGradient);
  return (
    <SelectorSection
      label="Gradient"
      data={GradientTypeOptions}
      renderItem={(gradient) => (
        <GradientOptionPreview
          type={gradient}
          onPress={() => qrcodeState$.selectedGradient.set(gradient)}
          isActive={gradientType === gradient}
        />
      )}
    />
  );
});
