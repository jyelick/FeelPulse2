import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import {
  Card,
  Button,
  TextInput,
  Chip,
  FAB,
  ActivityIndicator,
  Modal,
  Portal,
  RadioButton,
  IconButton
} from 'react-native-paper';
import { theme } from '../utils/theme';
import { 
  saveStressEvent, 
  getStressEvents, 
  deleteStressEvent, 
  getStressEventStats,
  updateStressEvent 
} from '../services/eventStorage';

const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  // Form state
  const [eventType, setEventType] = useState('work');
  const [intensity, setIntensity] = useState(3);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  const eventTypes = [
    { value: 'work', label: '💼 Work', color: '#2196F3' },
    { value: 'personal', label: '👤 Personal', color: '#9C27B0' },
    { value: 'health', label: '🏥 Health', color: '#FF5722' },
    { value: 'relationship', label: '❤️ Relationship', color: '#E91E63' },
    { value: 'financial', label: '💰 Financial', color: '#FF9800' },
    { value: 'travel', label: '✈️ Travel', color: '#009688' },
    { value: 'family', label: '👨‍👩‍👧‍👦 Family', color: '#795548' },
    { value: 'other', label: '📝 Other', color: '#607D8B' }
  ];

  const intensityLevels = [
    { value: 1, label: 'Very Low', color: '#4CAF50', emoji: '😌' },
    { value: 2, label: 'Low', color: '#8BC34A', emoji: '🙂' },
    { value: 3, label: 'Moderate', color: '#FF9800', emoji: '😐' },
    { value: 4, label: 'High', color: '#FF5722', emoji: '😰' },
    { value: 5, label: 'Very High', color: '#F44336', emoji: '😫' }
  ];

  const loadData = async () => {
    try {
      const [eventsData, statsData] = await Promise.all([
        getStressEvents(30), // Last 30 days
        getStressEventStats(30)
      ]);
      
      setEvents(eventsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading events data:', error);
      Alert.alert('Error', 'Failed to load events. Please try again.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    };

    initializeData();
  }, []);

  const resetForm = () => {
    setEventType('work');
    setIntensity(3);
    setDescription('');
    setNotes('');
    setEditingEvent(null);
  };

  const handleAddEvent = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description for the event.');
      return;
    }

    try {
      const eventData = {
        type: eventType,
        intensity,
        description: description.trim(),
        notes: notes.trim(),
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      };

      if (editingEvent) {
        // Update existing event
        const success = await updateStressEvent(editingEvent.id, eventData);
        if (success) {
          Alert.alert('Success', 'Event updated successfully!');
        }
      } else {
        // Create new event
        const newEvent = await saveStressEvent(eventData);
        if (newEvent) {
          Alert.alert('Success', 'Stress event logged successfully!');
        }
      }

      setShowAddModal(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Error saving event:', error);
      Alert.alert('Error', 'Failed to save event. Please try again.');
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventType(event.type);
    setIntensity(event.intensity);
    setDescription(event.description);
    setNotes(event.notes);
    setShowAddModal(true);
  };

  const handleDeleteEvent = (event) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this stress event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteStressEvent(event.id);
            if (success) {
              await loadData();
            } else {
              Alert.alert('Error', 'Failed to delete event.');
            }
          }
        }
      ]
    );
  };

  const getTypeInfo = (type) => {
    return eventTypes.find(t => t.value === type) || eventTypes[eventTypes.length - 1];
  };

  const getIntensityInfo = (intensity) => {
    return intensityLevels.find(i => i.value === intensity) || intensityLevels[2];
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading stress events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Stress Events</Text>
        
        {/* Statistics Card */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>📊 Event Overview (Last 30 days)</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalEvents || 0}</Text>
                <Text style={styles.statLabel}>Total Events</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.averageIntensity || 0}</Text>
                <Text style={styles.statLabel}>Avg Intensity</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.highStressEvents || 0}</Text>
                <Text style={styles.statLabel}>High Stress</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.eventsThisWeek || 0}</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
            </View>
            {stats.mostCommonType && (
              <Text style={styles.mostCommonType}>
                Most common: {getTypeInfo(stats.mostCommonType).label}
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Events List */}
        <Text style={styles.sectionTitle}>Recent Events</Text>
        
        {events.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No stress events recorded yet.</Text>
              <Text style={styles.emptyStateSubtext}>
                Tap the + button to log your first stress event and start building insights.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          events.map((event) => {
            const typeInfo = getTypeInfo(event.type);
            const intensityInfo = getIntensityInfo(event.intensity);
            
            return (
              <Card key={event.id} style={styles.eventCard}>
                <Card.Content>
                  <View style={styles.eventHeader}>
                    <View style={styles.eventTypeChip}>
                      <Chip 
                        mode="outlined" 
                        textStyle={{ color: typeInfo.color }}
                        style={{ borderColor: typeInfo.color }}
                      >
                        {typeInfo.label}
                      </Chip>
                    </View>
                    <View style={styles.eventActions}>
                      <IconButton
                        icon="pencil"
                        size={20}
                        onPress={() => handleEditEvent(event)}
                      />
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => handleDeleteEvent(event)}
                      />
                    </View>
                  </View>
                  
                  <Text style={styles.eventDescription}>{event.description}</Text>
                  
                  <View style={styles.eventDetails}>
                    <View style={styles.intensityContainer}>
                      <Text style={styles.intensityLabel}>Intensity: </Text>
                      <Text style={[styles.intensityValue, { color: intensityInfo.color }]}>
                        {intensityInfo.emoji} {intensityInfo.label} ({event.intensity}/5)
                      </Text>
                    </View>
                    
                    <Text style={styles.eventTimestamp}>
                      📅 {formatDateTime(event.timestamp)}
                    </Text>
                  </View>
                  
                  {event.notes && (
                    <Text style={styles.eventNotes}>💭 {event.notes}</Text>
                  )}
                </Card.Content>
              </Card>
            );
          })
        )}
      </ScrollView>

      {/* Add Event Modal */}
      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => {
            setShowAddModal(false);
            resetForm();
          }}
          contentContainerStyle={styles.modal}
        >
          <ScrollView>
            <Text style={styles.modalTitle}>
              {editingEvent ? 'Edit Stress Event' : 'Add Stress Event'}
            </Text>
            
            {/* Event Type */}
            <Text style={styles.fieldLabel}>Event Type</Text>
            <View style={styles.chipContainer}>
              {eventTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => setEventType(type.value)}
                >
                  <Chip
                    mode={eventType === type.value ? 'flat' : 'outlined'}
                    selected={eventType === type.value}
                    style={[styles.typeChip, eventType === type.value && { backgroundColor: type.color + '20' }]}
                    textStyle={{ color: eventType === type.value ? type.color : theme.colors.text }}
                  >
                    {type.label}
                  </Chip>
                </TouchableOpacity>
              ))}
            </View>

            {/* Stress Intensity */}
            <Text style={styles.fieldLabel}>Stress Intensity</Text>
            <RadioButton.Group
              onValueChange={(value) => setIntensity(parseInt(value))}
              value={intensity.toString()}
            >
              {intensityLevels.map((level) => (
                <View key={level.value} style={styles.radioItem}>
                  <RadioButton value={level.value.toString()} />
                  <Text style={[styles.radioLabel, { color: level.color }]}>
                    {level.emoji} {level.label} ({level.value}/5)
                  </Text>
                </View>
              ))}
            </RadioButton.Group>

            {/* Description */}
            <TextInput
              label="Event Description *"
              value={description}
              onChangeText={setDescription}
              style={styles.textInput}
              multiline
              numberOfLines={2}
              placeholder="Brief description of the stressful event..."
            />

            {/* Notes */}
            <TextInput
              label="Additional Notes"
              value={notes}
              onChangeText={setNotes}
              style={styles.textInput}
              multiline
              numberOfLines={3}
              placeholder="Any additional context, triggers, or observations..."
            />

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleAddEvent}
                style={styles.modalButton}
              >
                {editingEvent ? 'Update' : 'Save Event'}
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setShowAddModal(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    margin: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: 'center',
  },
  mostCommonType: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 2,
  },
  eventCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventTypeChip: {
    flex: 1,
  },
  eventActions: {
    flexDirection: 'row',
  },
  eventDescription: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 10,
    fontWeight: '500',
  },
  eventDetails: {
    marginBottom: 8,
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  intensityLabel: {
    fontSize: 14,
    color: theme.colors.text,
  },
  intensityValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  eventTimestamp: {
    fontSize: 12,
    color: theme.colors.text,
    opacity: 0.7,
  },
  eventNotes: {
    fontSize: 14,
    color: theme.colors.text,
    fontStyle: 'italic',
    marginTop: 5,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: theme.colors.primary,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 10,
    marginTop: 15,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  typeChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  textInput: {
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default EventsScreen;