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
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  statLabel: {
    color: '#666',
  },
  statValue: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    color: '#999',
  },
  penaltyCard: {
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  penaltyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  penaltyInfo: {
    flex: 1,
  },
  livreTitle: {
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 4,
  },
  userName: {
    color: '#666',
  },
  details: {
    backgroundColor: '#F9F9F9',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    color: '#666',
  },
  detailValue: {
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  payButton: {
    flex: 1,
    backgroundColor: '#51CF66',
  },
  cancelButton: {
    flex: 1,
  },
  waiveButton: {
    flex: 1,
  },
  dialogInfo: {
    color: '#666',
    marginBottom: 8,
  },
  reasonInput: {
    marginTop: 12,
    backgroundColor: '#F9F9F9',
  },
});

export default styles;
