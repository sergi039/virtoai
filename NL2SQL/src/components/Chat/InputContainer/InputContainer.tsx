import * as React from 'react';
import { Stack, TextField, IconButton, styled, Dropdown, IDropdownOption } from '@fluentui/react';
import type { IInputContainerProps, IInputContainerStyleProps, IInputContainerStyles } from './InputContainer.types';
import { getStyles, getClassNames } from './InputContainer.styles';
import { useState, useEffect, useRef } from 'react';
import { useNL2SQLStore } from '../../../stores/useNL2SQLStore';
import strings from '../../../Ioc/en-us';
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { IAIModel } from '../../../api/model';

const InputContainerBase: React.FunctionComponent<IInputContainerProps> = ({ onSubmit, theme: customTheme }) => {
  const { currentTheme, aiModels, selectedAIModels, setSelectedAIModels, getSpeechToken, getTextToInsert, clearTextToInsert } = useNL2SQLStore();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [audioData, setAudioData] = useState<number[]>(new Array(20).fill(0));
  const styleProps: IInputContainerStyleProps = { theme: customTheme || currentTheme };
  const classNames = getClassNames(getStyles, styleProps);
  const styleNames = getStyles(styleProps);
  const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null);
  const tempRecognizedTextRef = useRef<string>('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const textToInsert = getTextToInsert();
    if (textToInsert) {
      setQuery(textToInsert);
      clearTextToInsert();
    }
  });

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit(query);
      setQuery('');
    }
  };

  const handleModelSelectionChange = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (!option) return;
    
    const model = option.data as IAIModel;
    const isSelected = selectedAIModels.some(m => m.id === model.id);
    
    if (isSelected) {
      if (selectedAIModels.length > 1) {
        setSelectedAIModels(selectedAIModels.filter(m => m.id !== model.id));
      }
    } else {
      setSelectedAIModels([...selectedAIModels, model]);
    }
  };

  const modelOptions: IDropdownOption[] = aiModels.map(model => ({
    key: model.id.toString(),
    text: model.name,
    data: model
  }));

  const selectedKeys = selectedAIModels.map(model => model.id.toString());

  const onRenderTitle = (selectedOptions?: IDropdownOption[]): JSX.Element => {
    if (!selectedOptions || selectedOptions.length === 0) {
      return <span>{strings.Chat.selectModels}</span>;
    }
    if (selectedOptions.length === aiModels.length) {
      return <span>{strings.Chat.allModels}</span>;
    }
    const modelNames = selectedOptions.map(option => option.text).join(', ');
    return <span>{modelNames}</span>;
  };

  const setupAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (!analyserRef.current || !isListening) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        const barCount = 20;
        const barsData = [];
        for (let i = 0; i < barCount; i++) {
          const start = Math.floor((i / barCount) * bufferLength);
          const end = Math.floor(((i + 1) / barCount) * bufferLength);
          const sum = dataArray.slice(start, end).reduce((a, b) => a + b, 0);
          const avg = sum / (end - start);
          barsData.push(Math.min(100, (avg / 255) * 100 * 2));
        }
        setAudioData(barsData);

        if (isListening) {
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };

      updateAudioLevel();
    } catch (error) {
      setVoiceError(strings.Chat.microphoneAccessDenied);
    }
  };

  const cleanupAudioVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setAudioData(new Array(20).fill(0));
  };

  useEffect(() => {
    const startRecognition = async () => {
      try {
        setVoiceError('');
        const speechConfig = await getSpeechToken();
        
        if (!speechConfig || !speechConfig.token || !speechConfig.region) {
          throw new Error(strings.Chat.speechConfigNotAvailable);
        }

        const config = sdk.SpeechConfig.fromAuthorizationToken(speechConfig.token, speechConfig.region);
        
        config.setProperty(sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs, "30000");
        config.setProperty(sdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs, "30000");
        config.setProperty(sdk.PropertyId.Speech_SegmentationSilenceTimeoutMs, "5000");
        
        const autoDetectConfig = sdk.AutoDetectSourceLanguageConfig.fromLanguages(["en-US", "ru-RU", "uk-UA"]);
        const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = sdk.SpeechRecognizer.FromConfig(config, autoDetectConfig, audioConfig);
        recognizerRef.current = recognizer;

        recognizer.recognizing = (_s, e) => {
          if (e.result.text) {
            tempRecognizedTextRef.current = e.result.text;
          }
        };

        recognizer.recognized = (_s, e: sdk.SpeechRecognitionEventArgs) => {
          if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
            const text = e.result.text;
            tempRecognizedTextRef.current = text;
          }
        };

        recognizer.canceled = (_s, e: sdk.SpeechRecognitionCanceledEventArgs) => {
          if (e.reason === sdk.CancellationReason.Error) {
            setVoiceError(`${strings.Chat.recognitionError}: ${e.errorDetails}`);
            setIsListening(false);
          }
        };

        recognizer.sessionStarted = () => {
          setupAudioVisualization();
        };

        recognizer.sessionStopped = () => {
          cleanupAudioVisualization();
        };

        recognizer.startContinuousRecognitionAsync(
          () => {
          },
          (err) => {
            setVoiceError(`${strings.Chat.recognitionStartError}: ${err}`);
            setIsListening(false);
          }
        );

      } catch (err) {
        setVoiceError(strings.Chat.errorStartingRecognition + ": " + (err as Error).message);
        setIsListening(false);
      }
    };

    if (isListening && !recognizerRef.current) {
      startRecognition();
    }

    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.stopContinuousRecognitionAsync();
        recognizerRef.current.close();
        recognizerRef.current = null;
      }
      cleanupAudioVisualization();
    };
  }, [isListening, getSpeechToken]);

  const handleVoiceClick = () => {
    tempRecognizedTextRef.current = '';
    setIsListening(true);
  };

  const handleVoiceConfirm = () => {
    setIsListening(false);
    if (tempRecognizedTextRef.current.trim()) {
      setQuery(tempRecognizedTextRef.current.trim());
    }
    tempRecognizedTextRef.current = '';
  };

  const handleVoiceCancel = () => {
    setIsListening(false);
    setVoiceError('');
    tempRecognizedTextRef.current = '';
  };

  return (
    <Stack className={classNames.root}>
      <div className={classNames.wrapper}>
        {!isListening ? (
          <TextField
            placeholder={strings.Chat.inputPlaceholder}
            value={query}
            multiline
            rows={1}
            autoAdjustHeight
            onChange={(_, newValue) => setQuery(newValue || '')}
            styles={styleNames.input}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter' && !ev.shiftKey) {
                ev.preventDefault();
                handleSubmit();
              }
            }}
          />
        ) : (
          <div className={classNames.voiceWaveContainer}>
            <div className={classNames.audioVisualizer}>
              {audioData.map((level, index) => (
                <div
                  key={index}
                  className={classNames.audioBar}
                  style={{
                    height: `${Math.max(4, level)}%`,
                    backgroundColor: level > 10 ? currentTheme?.palette.themePrimary : currentTheme?.palette.neutralLighter,
                  }}
                />
              ))}
            </div>
            <div className={classNames.voiceText}>
              {tempRecognizedTextRef.current || strings.Chat.listening}
            </div>
          </div>
        )}

        <div className={classNames.actionsRow}>
          <div className={classNames.toolButtons}>
            {voiceError && <span className={classNames.errorText}>{voiceError}</span>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!isListening ? (
              <>
                <Dropdown
                  options={modelOptions}
                  selectedKeys={selectedKeys}
                  multiSelect
                  onChange={handleModelSelectionChange}
                  styles={styleNames.modelDropdown}
                  ariaLabel={strings.Chat.model}
                  onRenderTitle={onRenderTitle}
                />
                <IconButton
                  iconProps={{ iconName: 'Microphone' }}
                  styles={styleNames.voiceButton}
                  onClick={handleVoiceClick}
                  ariaLabel={strings.Chat.voiceInput}
                />
                <IconButton
                  iconProps={{ iconName: 'Send' }}
                  styles={styleNames.submitButton}
                  onClick={handleSubmit}
                  disabled={!query.trim()}
                  ariaLabel={strings.Chat.sendMessage}
                />
              </>
            ) : (
              <>
                <IconButton
                  iconProps={{ iconName: 'Cancel' }}
                  styles={styleNames.cancelButton}
                  onClick={handleVoiceCancel}
                  ariaLabel={strings.Chat.cancelVoiceInput}
                />
                <IconButton
                  iconProps={{ iconName: 'CheckMark' }}
                  styles={styleNames.confirmButton}
                  onClick={handleVoiceConfirm}
                  ariaLabel={strings.Chat.confirmVoiceInput}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Stack>
  );
};

export const InputContainer = styled<IInputContainerProps, IInputContainerStyleProps, IInputContainerStyles>(
  InputContainerBase,
  getStyles,
  undefined,
  { scope: 'InputContainer' }
);