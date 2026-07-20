import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, shadows } from '../../index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 40,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  adminBadgeText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
  },
  bookCoverContainer: {
    paddingVertical: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookCover: {
    width: 120,
    height: 160,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium
  },
  statusBanner: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  statusBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
  statusBannerAvailable: {
    backgroundColor: colors.lightGray,
  },
  statusBannerUnavailable: {
    backgroundColor: colors.lightGray,
  },
  statusBannerText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
  statusBannerTextAvailable: {
    color: colors.success,
  },
  statusBannerTextUnavailable: {
    color: colors.danger,
  },
  detailsContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
  titre: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  metadataContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  metadataLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 0.4,
  },
  metadataLabelText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
  },
  metadataValue: {
    fontSize: fontSizes.base,
    color: colors.dark,
    flex: 0.6,
  },
  resumeSection: {
    marginBottom: spacing.lg,
  },
  resumeLabel: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  resumeText: {
    fontSize: fontSizes.sm,
    color: colors.dark,
    lineHeight: 20,
  },
  adminStockContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  adminStockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  adminStockTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
  },
  adminStockContent: {
    gap: spacing.md,
  },
  stockInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockLabel: {
    fontSize: fontSizes.base,
    color: colors.dark,
    fontWeight: fontWeights.medium,
  },
  stockValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  stockUpdateInfo: {
    fontSize: fontSizes.xs,
    color: colors.gray,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  borrowButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.medium
  },
  borrowButtonDisabled: {
    backgroundColor: colors.gray,
    opacity: 0.6,
  },
  borrowButtonText: {
    color: colors.white,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
  borrowButtonTextDisabled: {
    color: colors.gray,
  },
  errorText: {
    fontSize: fontSizes.base,
    color: colors.danger,
    marginTop: spacing.md,
  },
});

export default styles;
