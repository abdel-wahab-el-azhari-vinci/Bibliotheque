import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon } from 'react-native-paper';

interface PenaltyAlertProps {
  totalAmount: number;
  isBlocking: boolean;
}

export default function PenaltyAlert({
  totalAmount,
  isBlocking,
}: PenaltyAlertProps) {
  if (!isBlocking) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon source="alert-circle" size={28} color="#FFF" />
        <View style={styles.textContainer}>
          <Text variant="titleSmall" style={styles.title}>
            Pénalités supérieures à €100
          </Text>
          <Text variant="bodySmall" style={styles.message}>
            Vous avez €{totalAmount.toFixed(2)} de pénalités en attente de paiement.
          </Text>
          <Text variant="bodySmall" style={styles.warning}>
            Vous ne pouvez pas emprunter de nouveaux livres tant que ce montant n'est pas payé à la bibliothèque.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    color: '#FFF',
    marginBottom: 6,
    opacity: 0.95,
  },
  warning: {
    color: '#FFF',
    opacity: 0.9,
    fontStyle: 'italic',
  },
});
