// Voici le changement à faire dans LivresListScreen.tsx
// À la ligne ~210-215, remplacer:
/*
        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={handleViewBorrowings} 
            style={{ marginRight: spacing.md }}
            activeOpacity={0.7}
          >
            <Ionicons name="bookmark" size={24} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
*/

// PAR:
/*
        <View style={styles.headerRight}>
          {user?.role === "ADMIN" && (
            <TouchableOpacity 
              onPress={() => navigation.navigate("AdminPanel")}
              style={{ marginRight: spacing.md }}
              activeOpacity={0.7}
            >
              <Ionicons name="cog" size={24} color={colors.white} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            onPress={handleViewBorrowings} 
            style={{ marginRight: spacing.md }}
            activeOpacity={0.7}
          >
            <Ionicons name="bookmark" size={24} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
*/
