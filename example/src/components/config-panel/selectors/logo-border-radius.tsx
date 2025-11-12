import { useAtom } from 'jotai';
import { NumberOptionPreview } from '../../number-option-preview';
import { SelectorSection } from '../selector-section';
import { LogoAreaBorderRadiusAtom } from '../../../states';
import React from 'react';

export const LogoBorderRadiusSelector = React.memo(() => {
  const [logoAreaBorderRadius, setLogoAreaBorderRadius] = useAtom(
    LogoAreaBorderRadiusAtom
  );
  return (
    <SelectorSection
      label="Logo Border Radius"
      customContent={
        <NumberOptionPreview
          max={100}
          min={0}
          value={logoAreaBorderRadius}
          onChange={setLogoAreaBorderRadius}
        />
      }
    />
  );
});
