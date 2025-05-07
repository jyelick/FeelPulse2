import React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryScatter, VictoryTooltip, VictoryVoronoiContainer } from 'victory-native';
import { theme } from '../utils/theme';

const HRVGraph = ({ data, height = 250 }) => {
  // Handle empty or insufficient data
  if (!data || data.length < 2) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.noDataText}>
          {!data || data.length === 0 
            ? 'No HRV data available yet' 
            : 'Need more data points for visualization'}
        </Text>
      </View>
    );
  }

  // Process data for Victory charts
  const chartData = data.map(item => ({
    x: new Date(item.date),
    y: item.value,
    label: `${item.value} ms\n${new Date(item.date).toLocaleDateString()}`
  }));

  // Calculate min and max values with some padding
  const values = data.map(item => item.value);
  const minValue = Math.max(0, Math.min(...values) - 5);
  const maxValue = Math.max(...values) + 5;

  // Set domain for the chart
  const domain = {
    y: [minValue, maxValue]
  };

  return (
    <View style={[styles.container, { height }]}>
      <VictoryChart
        height={height}
        width={Dimensions.get('window').width - 60}
        theme={VictoryTheme.material}
        domain={domain}
        containerComponent={
          <VictoryVoronoiContainer
            voronoiDimension="x"
            labels={({ datum }) => `${datum.y} ms\n${new Date(datum.x).toLocaleDateString()}`}
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
        <VictoryAxis
          tickFormat={(x) => {
            const date = new Date(x);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }}
          style={{
            axis: { stroke: theme.colors.outline },
            tickLabels: { 
              fontSize: 10, 
              padding: 5,
              fill: theme.colors.onSurfaceVariant 
            }
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(y) => `${y}`}
          style={{
            axis: { stroke: theme.colors.outline },
            tickLabels: { 
              fontSize: 10, 
              padding: 5,
              fill: theme.colors.onSurfaceVariant 
            }
          }}
        />
        <VictoryLine
          data={chartData}
          style={{
            data: { 
              stroke: theme.colors.primary,
              strokeWidth: 3 
            }
          }}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 }
          }}
        />
        <VictoryScatter
          data={chartData}
          size={6}
          style={{
            data: {
              fill: theme.colors.primaryContainer,
              stroke: theme.colors.primary,
              strokeWidth: 2
            }
          }}
        />
      </VictoryChart>
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
  }
});

export default HRVGraph;
