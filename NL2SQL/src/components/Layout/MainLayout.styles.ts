import { classNamesFunction } from '@fluentui/react';
import type { IMainLayoutStyleProps, IMainLayoutStyles } from './MainLayout.types';

export const getStyles = (props: IMainLayoutStyleProps): IMainLayoutStyles => {
  const { theme } = props;

  return {
    root: {
      display: 'flex',
      maxHeight: '100vh',
      overflowX: 'hidden'
    },
    emptyContainer: {
      maxWidth: '800px',
      width: '100%',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    title: {
      fontSize: '26px',
      fontWeight: 500,
      marginBottom: '25px',
      color: theme?.palette.neutralPrimary,
    },
    mainContainer: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      overflowX: "hidden",
      maxHeight: "98vh",
      marginLeft: "260px",
      position: "relative",
      justifyContent: "center"
    },
    fullWidthInputContainer: {
      width: '100%'
    }
  };
};

export const getClassNames = classNamesFunction<IMainLayoutStyleProps, IMainLayoutStyles>();