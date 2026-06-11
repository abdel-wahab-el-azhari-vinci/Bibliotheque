import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, shadows } from '../../index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingVertical: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  logoSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.large,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: colors.gray,
  },
  formSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    ...shadows.medium
  },
  input: {
    flex: 1,
    padding: spacing.md,
    fontSize: fontSizes.base,
    color: colors.dark,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  eyeIcon: {
    padding: spacing.sm,
  },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: spacing.xl,
    ...shadows.large,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    color: colors.gray,
    fontSize: fontSizes.base,
  },
  loginLink: {
    color: colors.secondary,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.base,
  },
});

export default styles;
