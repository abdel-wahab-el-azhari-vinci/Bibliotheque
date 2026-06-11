import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, shadows } from '../../index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  summaryCard: {
    marginBottom: 16,
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0066CC',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontWeight: 'bold',
    color: '#0066CC',
  },
  emptyCard: {
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptySubText: {
    color: '#999',
  },
  penaltyCard: {
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  penaltyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  livreTitle: {
    flex: 1,
    fontWeight: 'bold',
    color: '#0066CC',
    marginRight: 8,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    color: '#999',
    marginBottom: 2,
  },
  dateValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  penaltyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    color: '#999',
    marginBottom: 2,
    fontSize: 11,
  },
  detailValue: {
    color: '#333',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 10,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  infoText: {
    marginLeft: 8,
    color: '#FF9800',
    flex: 1,
  },
  paidBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8F5',
    padding: 10,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#51CF66',
  },
  paidText: {
    marginLeft: 8,
    color: '#51CF66',
    flex: 1,
  },
});

export default styles;
