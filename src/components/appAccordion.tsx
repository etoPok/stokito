import { ReactNode, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TextStyle,
  Pressable,
  Text,
  ViewStyle,
  StyleProp,
} from 'react-native';

type AppAccordionProps = {
  title: string;
  children: (value: {
    sendExpandedValue: (value: boolean) => void;
  }) => ReactNode;
  disabled?: boolean;
  expand?: boolean;
  buttonContainerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
};

export function AppAccordion({
  title,
  children,
  disabled = false,
  expand = false,
  buttonContainerStyle,
  buttonStyle,
  titleStyle,
  onPress,
}: AppAccordionProps) {
  const [expanded, setExpanded] = useState(expand);
  useEffect(() => {
    setExpanded(expand);
  }, [expand]);

  return (
    <>
      <View style={buttonContainerStyle}>
        <Pressable
          style={buttonStyle}
          onPress={() => {
            setExpanded(!expanded);
            if (onPress !== undefined) onPress();
          }}
          disabled={disabled}
        >
          <Text style={titleStyle}> {title} </Text>
        </Pressable>
      </View>
      {expanded &&
        children({
          sendExpandedValue: (value: boolean) => {
            setExpanded(value);
          },
        })}
    </>
  );
}

export const appAccordionStyles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#1A1D24',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2F3A',
  },
  buttonText: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '500',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  itemText: {
    color: '#E6EAF2',
    fontSize: 16,
  },
  itemDetailText: {
    color: '#9AA3B2',
    fontSize: 13,
  },
  dropdown: {
    backgroundColor: '#111',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 10,
    marginHorizontal: 18,
  },
});
