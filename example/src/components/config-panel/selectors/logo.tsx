import { useAtom } from 'jotai';
import { LogoEmojis, SelectedLogoAtom } from '../../../states';
import { SelectorSection } from '../selector-section';
import { LogoOptionPreview } from '../../logo-option-preview';
import React from 'react';

export const LogoSelector = React.memo(() => {
  const [selectedLogo, setSelectedLogo] = useAtom(SelectedLogoAtom);
  return (
    <SelectorSection
      label="Logo"
      data={LogoEmojis}
      renderItem={(logo) => (
        <LogoOptionPreview
          isActive={selectedLogo === logo}
          onPress={() => setSelectedLogo(logo)}
          logoEmoji={logo}
        />
      )}
    />
  );
});
