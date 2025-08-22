import * as React from 'react';
import { Stack, Text, styled } from '@fluentui/react';
import type { IExamplesContainerProps, IExamplesContainerStyleProps, IExamplesContainerStyles } from './ExamplesContainer.types';
import { getStyles, getClassNames } from './ExamplesContainer.styles';
import { useNL2SQLStore } from '../../../stores/useNL2SQLStore';

const ExamplesContainerBase: React.FunctionComponent<IExamplesContainerProps> = ({
  examples,
  onExampleClick,
  theme: customTheme,
}) => {
  const currentTheme = useNL2SQLStore((state) => state.currentTheme);
  const styleProps: IExamplesContainerStyleProps = { theme: customTheme || currentTheme };
  const classNames = getClassNames(getStyles, styleProps);

  return (
    <Stack className={classNames.root}>
      <Stack horizontal className={classNames.grid}>
        {examples.map((example, index) => (
          <Stack
            key={index}
            className={classNames.example}
            onClick={() => onExampleClick(example.text)}
          >
            <Text className={classNames.exampleTitle}>{example.title}</Text>
            <Text className={classNames.exampleText}>{example.text}</Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export const ExamplesContainer = styled<IExamplesContainerProps, IExamplesContainerStyleProps, IExamplesContainerStyles>(
  ExamplesContainerBase,
  getStyles,
  undefined,
  { scope: 'ExamplesContainer' }
);