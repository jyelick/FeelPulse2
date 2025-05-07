import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, Button, IconButton } from 'react-native-paper';
import { theme } from '../utils/theme';

const StressDetectionAlert = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <IconButton
              icon="alert-circle-outline"
              size={24}
              color={theme.colors.error}
              style={styles.icon}
            />
            <Text style={styles.title}>Stress Alert</Text>
          </View>
          <IconButton
            icon="close"
            size={20}
            onPress={() => setDismissed(true)}
          />
        </View>
        
        <Text style={styles.message}>
          Your stress levels appear to be accumulating. Consider prioritizing self-care 
          and stress-relieving activities over the next few days.
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => {/* Navigate to resources or tips */}}
            style={styles.button}
            buttonColor={theme.colors.tertiaryContainer}
            textColor={theme.colors.onTertiaryContainer}
          >
            View Self-Care Tips
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => setDismissed(true)}
            style={styles.button}
          >
            Dismiss
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: theme.colors.errorContainer,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    margin: 0,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.error,
  },
  message: {
    marginVertical: 12,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.onErrorContainer,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default StressDetectionAlert;
