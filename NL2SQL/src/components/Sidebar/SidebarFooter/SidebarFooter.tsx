import { ContextualMenu, DefaultButton, IContextualMenuItem, Persona, PersonaSize, Stack, Text, styled } from '@fluentui/react';
import { useMsal } from '@azure/msal-react';
import type { ISidebarFooterProps, ISidebarFooterStyleProps, ISidebarFooterStyles } from './SidebarFooter.types';
import { getStyles, getClassNames } from './SidebarFooter.styles';
import { useNL2SQLStore } from '../../../stores/useNL2SQLStore';
import strings from '../../../Ioc/en-us';
import { useRef, useState } from 'react';
import { SettingPanel } from '../SettingPanel';
import { RulesPanel } from '../RulesPanel';

const SidebarFooterBase: React.FunctionComponent<ISidebarFooterProps> = ({ theme: customTheme }) => {
  const { 
    currentTheme, 
    currentUser, 
    azureUser, 
    userPhoto, 
    clearUserData 
  } = useNL2SQLStore();
  
  const { instance } = useMsal();
  const userDisplayName = azureUser?.name || azureUser?.username || `${currentUser.firstName} ${currentUser.lastName}`;

  const styleProps: ISidebarFooterStyleProps = { theme: customTheme || currentTheme };
  const classNames = getClassNames(getStyles, styleProps);
  const styleNames = getStyles(styleProps);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [isRulesPanelOpen, setIsRulesPanelOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const menuItems: IContextualMenuItem[] = [
    {
      key: 'settings',
      text: strings.UserOptions.settings,
      iconProps: { iconName: 'Settings' },
    },
    {
      key: 'rules',
      text: strings.UserOptions.rules,
      iconProps: { iconName: 'ComplianceAudit' },
    },
    {
      key: 'contactus',
      text: strings.UserOptions.contact,
      iconProps: { iconName: 'ChatInviteFriend' },
    },
    {
      key: 'logout',
      text: strings.UserOptions.logout,
      iconProps: { iconName: 'SignOut' },
    }
  ];

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleMenuDismiss = () => {
    setIsMenuVisible(false);
  };

  const handleMenuItemClick = (item?: IContextualMenuItem) => {
    switch (item?.key) {
      case 'settings':
        setIsPanelOpen(true);
        break;
      case 'rules':
        setIsRulesPanelOpen(true);
        break;
      case 'contactus':
        break;
      case 'logout':
        clearUserData();
        instance.logoutRedirect({
          postLogoutRedirectUri: "/"
        }).catch(e => {
          console.error('Logout error:', e);
        });
        break;
    }
    setIsMenuVisible(false);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  const closeRulesPanel = () => {
    setIsRulesPanelOpen(false);
  };

  return (
    <Stack className={classNames.root}>
      <div ref={buttonRef}>
        <DefaultButton
          styles={styleNames.button}
          onClick={toggleMenu}
        >
          <Persona
            imageUrl={userPhoto || currentUser.avatarUrl}
            size={PersonaSize.size32}
            text={userDisplayName} 
            hidePersonaDetails={true}
            className={classNames.avatar}
          />
          <Stack>
            <Text className={classNames.text}>{userDisplayName}</Text>
          </Stack>
        </DefaultButton>
      </div>

      {isMenuVisible && (
        <ContextualMenu
          items={menuItems}
          hidden={!isMenuVisible}
          target={buttonRef.current}
          onItemClick={(_, item) => handleMenuItemClick(item)}
          onDismiss={handleMenuDismiss}
          styles={styleNames.menu}
        />
      )}

      <SettingPanel
        isOpen={isPanelOpen}
        onDismiss={closePanel}
        theme={customTheme || currentTheme}
      />

      <RulesPanel
        isOpen={isRulesPanelOpen}
        onDismiss={closeRulesPanel}
        theme={customTheme || currentTheme}
      />
    </Stack>
  );
};

export const SidebarFooter = styled<ISidebarFooterProps, ISidebarFooterStyleProps, ISidebarFooterStyles>(
  SidebarFooterBase,
  getStyles,
  undefined,
  { scope: 'SidebarFooter' }
);