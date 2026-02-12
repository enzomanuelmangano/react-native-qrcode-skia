import { useSelector } from '@legendapp/state/react';
import { LogoEmojis, qrcodeState$ } from '../../../states';
import { SelectorSection } from '../selector-section';
import { LogoOptionPreview } from '../../logo-option-preview';
import React from 'react';

export const LogoSelector = React.memo(() => {
  const selectedLogo = useSelector(qrcodeState$.selectedLogo);
  return (
    <SelectorSection
      label="Logo"
      data={LogoEmojis}
      renderItem={(logo) => (
        <LogoOptionPreview
          isActive={selectedLogo === logo}
          onPress={() => qrcodeState$.selectedLogo.set(logo)}
          logoEmoji={logo}
        />
      )}
    />
  );
});
