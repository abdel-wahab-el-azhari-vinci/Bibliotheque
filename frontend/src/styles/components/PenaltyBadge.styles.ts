import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, shadows } from '../index';

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

export default styles;
