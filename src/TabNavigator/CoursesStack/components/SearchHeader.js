import { Ionicons } from '@expo/vector-icons';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchHeader = ({ search, setSearch, submitSearch }) => (
  <View style={styles.searchWrapper}>
    <Ionicons name="search-outline" size={16} color="#4A5568" />
    <TextInput
      style={styles.searchInput}
      placeholder="Search completed courses"
      placeholderTextColor="#4A5568"
      value={search}
      onChangeText={setSearch}
      onSubmitEditing={submitSearch}
    />
  </View>
);

const styles = StyleSheet.create({
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    paddingHorizontal: 14,
    height: 46,
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default SearchHeader;
