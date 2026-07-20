import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, shadows } from '../../index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSizes.md,
    color: colors.gray,
    marginTop: spacing.md,
  },
  noData: {
    fontSize: fontSizes.md,
    color: colors.gray,
    marginHorizontal: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  emptySection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptySectionText: {
    fontSize: fontSizes.md,
    color: colors.gray,
    marginTop: spacing.md,
  },
  borrowCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: spacing.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  bookInfo: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconContainer: {
    width: 60,
    height: 80,
    backgroundColor: colors.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  titre: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  auteur: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: fontWeights.medium,
    marginBottom: spacing.xs,
  },
  genre: {
    fontSize: fontSizes.xs,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateText: {
    fontSize: fontSizes.xs,
    color: colors.gray,
  },
  statusBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeActive: {
    backgroundColor: colors.lightSuccess,
  },
  statusBadgeOverdue: {
    backgroundColor: colors.lightDanger,
  },
  statusBadgeReturned: {
    backgroundColor: colors.lightGray,
  },
  statusBadgeText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  details: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopColor: colors.lightGray,
    borderTopWidth: 1,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: fontSizes.sm,
    color: colors.gray,
    fontWeight: fontWeights.medium,
  },
  detailValue: {
    fontSize: fontSizes.sm,
    color: colors.text,
    fontWeight: fontWeights.semibold,
  },
  textOverdue: {
    color: colors.danger,
  },
  returnButton: {
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 6,
    marginTop: spacing.sm,
  },
  returnButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
  returnButtonText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
  },
  returnButtonTextDisabled: {
    color: colors.gray,
  },
});

export default styles;
