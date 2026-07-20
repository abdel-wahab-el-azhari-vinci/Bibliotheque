import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, shadows } from '../index';

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

export default styles;
