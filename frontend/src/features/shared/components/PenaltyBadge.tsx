import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Badge, Text, Icon } from 'react-native-paper';
import { useAuth } from '../../../context/AuthContext';
import { penaltiesApi } from '../../livres/api/penaltiesApi';

interface PenaltyBadgeProps {
  onPress?: () => void;
}

export default function PenaltyBadge({ onPress }: PenaltyBadgeProps) {
  const { authState } = useAuth();
  const token = authState?.access_token || '';

  const [pendingCount, setPendingCount] = useState(0);
  const [isBlocking, setIsBlocking] = useState(false);

  useEffect(() => {
    if (token) {
      loadPenaltySummary();
    }
  }, [token]);

  const loadPenaltySummary = async () => {
    try {
      const summary = await penaltiesApi.getPenaltySummary(token);
      setPendingCount(summary.pendingPenaltiesCount);
      setIsBlocking(!summary.canBorrow);
    } catch (error) {
      console.error('Failed to load penalty summary:', error);
    }
  };

  if (pendingCount === 0) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isBlocking ? styles.containerBlocking : styles.containerWarning,
      ]}
      onPress={onPress}
    >
      <Icon
        source={isBlocking ? 'alert-circle' : 'information-outline'}
        size={20}
        color="#FFF"
      />
      <Text variant="labelSmall" style={styles.text}>
        {pendingCount} pénalité{pendingCount > 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 12,
    marginVertical: 8,
  },
  containerWarning: {
    backgroundColor: '#FFB74D',
  },
  containerBlocking: {
    backgroundColor: '#FF6B6B',
  },
  text: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
