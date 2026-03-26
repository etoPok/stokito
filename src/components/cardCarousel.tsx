import { ReactNode, useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

export function CardCarousel({
  data,
  renderItem,
}: {
  data: any[];
  renderItem: (item: any) => ReactNode;
}) {
  const [contanierWidth, setContainerWidth] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (data.length > 0) {
      flatListRef.current?.scrollToIndex({
        index: data.length - 1,
        animated: true,
      });
    }
  }, [data.length]);

  if (data.length === 0) {
    return <View style={styles.cardContainer}>{renderItem(null)}</View>;
  }

  return (
    <View
      style={{ width: '100%' }}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {contanierWidth > 0 && (
        <FlatList
          ref={flatListRef}
          data={data}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: contanierWidth,
            offset: contanierWidth * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={[styles.cardContainer, { width: contanierWidth }]}>
              {renderItem(item)}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
