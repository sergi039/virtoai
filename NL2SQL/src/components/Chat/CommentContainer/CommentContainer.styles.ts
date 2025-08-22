import { classNamesFunction } from '@fluentui/react';
import type { ICommentContainerStyleProps, ICommentContainerStyles } from './CommentContainer.types';

export const getStyles = (props: ICommentContainerStyleProps): ICommentContainerStyles => {
  const { theme, isVisible } = props;

  return {
    root: {
      root: {
        display: isVisible ? 'block' : 'none',
        maxWidth: '800px',
        width: '100%',
        margin: '8px auto 0',
      },
    },
    input: {
      root: {
        width: '100%',
      },
      field: {
        padding: '8px',
        border: `1px solid ${theme?.palette.neutralLighter}`,
        borderRadius: '4px',
        fontSize: '14px',
      },
    },
  };
};

export const getClassNames = classNamesFunction<ICommentContainerStyleProps, ICommentContainerStyles>();