import useKeyboard from '@rnhooks/keyboard';
import {atom, useAtom} from 'jotai';
import React, {useRef} from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaProvider,
  initialWindowMetrics,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type Behavior = 'height' | 'position' | 'padding' | undefined | false;

function getDefaultBehavior(): Behavior {
  if (Platform.OS === 'ios') {
    return 'padding';
  }
  return undefined;
}

const behaviorAtom = atom(getDefaultBehavior());

function App(): JSX.Element {
  const [behavior] = useAtom(behaviorAtom);

  const bottomTextInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();
  const maxDeviceFrame = useRef(frame.height);
  const [visibleWillShow] = useKeyboard({
    useWillHide: true,
    useWillShow: true,
  });
  const [visible] = useKeyboard();
  if (frame.height > maxDeviceFrame.current) {
    maxDeviceFrame.current = frame.height;
  }
  const screen = Dimensions.get('screen');
  const window = Dimensions.get('window');

  return (
    <View style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={behavior === false ? undefined : behavior}
        enabled={behavior !== false}
        style={{flex: 1, paddingHorizontal: 20}}
        contentContainerStyle={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{
            height: maxDeviceFrame.current,
          }}
          ref={scrollViewRef}
          bounces={false}>
          <View style={{height: insets.top}} />
          <Text>Top!</Text>
          <TextInput
            style={{
              borderWidth: 1,
            }}
          />
          <RowSwitch title="height" />
          <RowSwitch title="padding" />
          <RowSwitch title="position" />
          <RowSwitch title={undefined} />
          <RowSwitch title={false} />
          <View style={{flex: 3}}>
            <ScrollView>
              <Text>
                {JSON.stringify(
                  {
                    maxDeviceFrame: maxDeviceFrame.current,
                    visible,
                    visibleWillShow,
                    metrics: Keyboard.metrics() ?? null,
                    dimensions,
                    frame,
                    insets,
                    window,
                    screen,
                    initialWindowMetrics,
                  },
                  null,
                  2,
                )}
              </Text>
            </ScrollView>
          </View>
          <TextInput
            ref={bottomTextInputRef}
            style={{
              borderWidth: 1,
            }}
            onFocus={() => {
              if (Platform.OS !== 'ios') {
                return;
              }
              let listener = () => {};
              const subscription = Keyboard.addListener('keyboardDidShow', () =>
                listener(),
              );
              listener = () => {
                requestAnimationFrame(() => {
                  scrollViewRef.current?.scrollTo({y: frame.height});
                });
                subscription.remove();
              };
            }}
          />
          <View style={{flex: 1}} />
          <Text>Bottom!</Text>
          {visible && visibleWillShow ? null : (
            <View style={{height: insets.bottom}} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default () => (
  <SafeAreaProvider>
    <App />
  </SafeAreaProvider>
);

function RowSwitch({title}: {title: Behavior}) {
  const [behavior, setBehavior] = useAtom(behaviorAtom);
  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <Text>{String(title)}</Text>
      </View>
      <View>
        <Switch
          onValueChange={() => setBehavior(title)}
          value={behavior === title}
        />
      </View>
    </View>
  );
}
