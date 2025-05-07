import React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryScatter, VictoryGroup, VictoryLegend, VictoryTooltip, VictoryVoronoiContainer } from 'victory-native';
import { theme } from '../utils/theme';

const CombinedTrendsGraph = ({ 
  hrvData = [], 
  moodData = [], 
  showHRV = true, 
  height = 280 
}) => {
  // Handle empty data
  const hasHRVData = hrvData && hrvData.length > 1;
  const hasMoodData = moodData && moodData.length > 1;
  
  if ((!hasHRVData && !hasMoodData) || (!hasHRVData && showHRV && !hasMoodData)) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.noDataText}>
          Not enough data available for visualization
        </Text>
      </View>
    );
  }

  // Process HRV data
  const hrvChartData = hasHRVData && showHRV ? hrvData.map(item => ({
    x: new Date(item.date),
    y: item.value,
    metric: 'HRV',
    label: `HRV: ${item.value} ms\n${new Date(item.date).toLocaleDateString()}`
  })) : [];

  // Process mood data
  const moodChartData = hasMoodData ? moodData.map(item => ({
    x: new Date(item.date || item.timestamp),
    y: item.mood,
    metric: 'Mood',
    label: `Mood: ${item.moodText || item.mood}/5\n${new Date(item.date || item.timestamp).toLocaleDateString()}`
  })) : [];
  
  // Create a single dataset for common date range
  const allDates = [...(showHRV ? hrvChartData : []), ...moodChartData].map(d => d.x.getTime());
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));

  // Normalize HRV values to plot on the same chart as mood
  const normalizeHRV = (value) => {
    // If no HRV data, skip normalization
    if (!hasHRVData || hrvData.length === 0) return 0;
    
    const hrvValues = hrvData.map(d => d.value);
    const minHRV = Math.min(...hrvValues);
    const maxHRV = Math.max(...hrvValues);
    const range = maxHRV - minHRV;
    
    // Normalize to 1-5 scale (same as mood)
    if (range === 0) return 3; // Middle value if no range
    return ((value - minHRV) / range) * 4 + 1;
  };

  // Normalized HRV data for visualization
  const normalizedHRVData = hasHRVData && showHRV ? hrvData.map(item => ({
    x: new Date(item.date),
    y: normalizeHRV(item.value),
    originalY: item.value,
    metric: 'HRV',
    label: `HRV: ${item.value} ms\n${new Date(item.date).toLocaleDateString()}`
  })) : [];

  return (
    <View style={[styles.container, { height }]}>
      <VictoryChart
        height={height}
        width={Dimensions.get('window').width - 60}
        domain={{ y: [0.5, 5.5], x: [minDate, maxDate] }}
        padding={{ top: 10, bottom: 30, left: 50, right: 20 }}
        containerComponent={
          <VictoryVoronoiContainer
            voronoiDimension="x"
            labels={({ datum }) => {
              if (datum.metric === 'HRV') {
                return `HRV: ${datum.originalY} ms\n${new Date(datum.x).toLocaleDateString()}`;
              } else {
                return `Mood: ${datum.y}/5\n${new Date(datum.x).toLocaleDateString()}`;
              }
            }}
            labelComponent={
              <VictoryTooltip
                cornerRadius={5}
                flyoutStyle={{
                  fill: theme.colors.surfaceVariant,
                  stroke: theme.colors.outline,
                }}
              />
            }
          />
        }
      >
        {/* Y axis with mood scale */}
        <VictoryAxis 
          dependentAxis
          tickValues={[1, 2, 3, 4, 5]}
          tickFormat={(t) => `${t}`}
          style={{
            axis: { stroke: theme.colors.outline },
            tickLabels: { fontSize: 10, fill: theme.colors.onSurfaceVariant }
          }}
        />
        
        {/* X axis with dates */}
        <VictoryAxis
          tickFormat={(x) => {
            const date = new Date(x);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }}
          style={{
            axis: { stroke: theme.colors.outline },
            tickLabels: { fontSize: 10, angle: -30, padding: 8, fill: theme.colors.onSurfaceVariant }
          }}
          tickCount={5}
        />
        
        {/* Legend */}
        <VictoryLegend
          x={Dimensions.get('window').width / 2 - 100}
          y={0}
          orientation="horizontal"
          gutter={20}
          colorScale={[theme.colors.primary, theme.colors.tertiary]}
          data={[
            { name: "HRV", symbol: { fill: theme.colors.primary } },
            { name: "Mood", symbol: { fill: theme.colors.tertiary } }
          ]}
          style={{ 
            labels: { fontSize: 10, fill: theme.colors.onSurface } 
          }}
        />
        
        {/* HRV Line */}
        {showHRV && hasHRVData && (
          <VictoryGroup data={normalizedHRVData}>
            <VictoryLine
              style={{
                data: { 
                  stroke: theme.colors.primary,
                  strokeWidth: 3,
                  strokeDasharray: [4, 4] // Dashed line for normalized HRV
                }
              }}
              animate={{ duration: 500 }}
            />
            <VictoryScatter
              size={4}
              style={{
                data: {
                  fill: theme.colors.primaryContainer,
                  stroke: theme.colors.primary,
                  strokeWidth: 2
                }
              }}
            />
          </VictoryGroup>
        )}
        
        {/* Mood Line */}
        {hasMoodData && (
          <VictoryGroup data={moodChartData}>
            <VictoryLine
              style={{
                data: { 
                  stroke: theme.colors.tertiary,
                  strokeWidth: 3
                }
              }}
              animate={{ duration: 500 }}
            />
            <VictoryScatter
              size={5}
              style={{
                data: {
                  fill: theme.colors.tertiaryContainer,
                  stroke: theme.colors.tertiary,
                  strokeWidth: 2
                }
              }}
            />
          </VictoryGroup>
        )}
      </VictoryChart>
      
      {/* Notes */}
      {showHRV && hasHRVData && (
        <Text style={styles.note}>
          Note: HRV values are normalized to the mood scale for comparison
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
  },
  note: {
    fontSize: 10,
    fontStyle: 'italic',
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: -20,
    marginBottom: 10,
  }
});

export default CombinedTrendsGraph;
