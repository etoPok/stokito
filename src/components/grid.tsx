import React, { useCallback, useMemo } from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';

type Breakpoints = {
  xs?: number; // < 480
  sm?: number; // 480 – 767
  md?: number; // 768 – 1023
  lg?: number; // >= 1024
};

const DEFAULT_BREAKPOINTS: Required<Breakpoints> = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
};

export function useBreakpointColumns(breakpoints?: Breakpoints): number {
  const { width } = useWindowDimensions();
  const bp = { ...DEFAULT_BREAKPOINTS, ...breakpoints };

  return useMemo(() => {
    if (width >= 1024) return bp.lg;
    if (width >= 768) return bp.md;
    if (width >= 480) return bp.sm;
    return bp.xs;
  }, [width, bp.xs, bp.sm, bp.md, bp.lg]);
}

const CONTAINER_HORIZONTAL_PADDING = 8;
const ITEM_HORIZONTAL_MARGIN = 4;

type Props<T> = {
  data: T[];
  renderItem: (item: T, itemWidth: number) => React.ReactElement;
  keyExtractor: (item: T) => string;
  breakpoints?: Breakpoints;
  containerPadding?: number;
  itemMargin?: number;
};

export function Grid<T>({
  data,
  renderItem,
  keyExtractor,
  breakpoints,
  containerPadding = CONTAINER_HORIZONTAL_PADDING,
  itemMargin = ITEM_HORIZONTAL_MARGIN,
}: Props<T>) {
  const { width } = useWindowDimensions();
  const numColumns = useBreakpointColumns(breakpoints);

  const itemWidth = useMemo(() => {
    const totalSpacing = 2 * containerPadding + numColumns * 2 * itemMargin;
    return (width - totalSpacing) / numColumns;
  }, [width, numColumns, containerPadding, itemMargin]);

  const renderCell = useCallback(
    ({ item }: { item: T }) => (
      <View
        style={{
          width: itemWidth,
          marginHorizontal: itemMargin,
          paddingBottom: itemMargin * 2,
        }}
      >
        {renderItem(item, itemWidth)}
      </View>
    ),
    [itemWidth, itemMargin, renderItem]
  );

  return (
    <FlatList
      data={data}
      key={numColumns}
      numColumns={numColumns}
      keyExtractor={keyExtractor}
      renderItem={renderCell}
      contentContainerStyle={{
        paddingHorizontal: containerPadding,
      }}
    />
  );
}
