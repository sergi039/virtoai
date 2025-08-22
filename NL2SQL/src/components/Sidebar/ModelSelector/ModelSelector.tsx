import * as React from 'react';
import { Stack, Text, styled } from '@fluentui/react';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import type { IModelSelectorProps, IModelSelectorStyleProps, IModelSelectorStyles } from './ModelSelector.types';
import { getStyles, getClassNames } from './ModelSelector.styles';
import { useNL2SQLStore } from '../../../stores/useNL2SQLStore';
import strings from '../../../Ioc/en-us';

const ModelSelectorBase: React.FunctionComponent<IModelSelectorProps> = ({
    theme: customTheme,
}) => {
    const {currentTheme, aiModels, currentAIModel, setCurrentAIModel} = useNL2SQLStore();
    
    const styleProps: IModelSelectorStyleProps = { theme: customTheme || currentTheme };
    const classNames = getClassNames(getStyles, styleProps);
    const styleNames = getStyles(styleProps);

    const modelOptions: IDropdownOption[] = aiModels.map(model => ({
        key: model.id,
        text: model.name,
        data: model
    }));

    const onChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        if (!event) return;

        if (option && option.data) {
            setCurrentAIModel(option.data);
        }
    };

    return (
        <Stack className={classNames.root}>
            <Text className={classNames.title}>{strings.Chat.model}</Text>
            <Stack className={classNames.content}>
                <Dropdown
                    options={modelOptions}
                    selectedKey={currentAIModel?.id}
                    onChange={onChange}
                    styles={styleNames.dropdown}
                />
            </Stack>
        </Stack>
    );
};

export const ModelSelector = styled<IModelSelectorProps, IModelSelectorStyleProps, IModelSelectorStyles>(
    ModelSelectorBase,
    getStyles,
    undefined,
    { scope: 'ModelSelector' }
);