import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

// ─── Reusable: Star Rating ────────────────────────────────────────────────────
function StarRating({ rating, onChange }) {
  return (
    <View style={srStyles.row}>
      {[1, 2, 3, 4, 5].map(star => (
        <TouchableOpacity
          key={star}
          onPress={() => onChange(star)}
          activeOpacity={0.75}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={36}
            color={star <= rating ? '#2563EB' : '#2A3A54'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
const srStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
});

// ─── Reusable: Checkbox Row ───────────────────────────────────────────────────
function CheckboxRow({ label, checked, onChange }) {
  return (
    <TouchableOpacity
      style={[cbStyles.row, checked && cbStyles.rowChecked]}
      onPress={() => onChange(!checked)}
      activeOpacity={0.85}
    >
      <View style={[cbStyles.box, checked && cbStyles.boxChecked]}>
        {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
      </View>
      <Text style={cbStyles.label}>{label}</Text>
    </TouchableOpacity>
  );
}
const cbStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    padding: 16,
    gap: 14,
  },
  rowChecked: { borderColor: '#2563EB', backgroundColor: '#0D1A33' },
  box: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#4A5568',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  label: { fontSize: 14, color: '#E2E8F0', fontWeight: '500' },
});

// ─── Reusable: Dropdown ───────────────────────────────────────────────────────
function Dropdown({ value, options, onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={ddStyles.trigger}
        onPress={() => setOpen(true)}
        activeOpacity={0.85}
      >
        <Text style={ddStyles.triggerText}>{value}</Text>
        <Ionicons name="chevron-down" size={16} color="#718096" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          style={ddStyles.backdrop}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={ddStyles.menu}>
            {options.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[
                  ddStyles.option,
                  opt === value && ddStyles.optionSelected,
                ]}
                onPress={() => {
                  onSelect(opt);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    ddStyles.optionText,
                    opt === value && ddStyles.optionTextSelected,
                  ]}
                >
                  {opt}
                </Text>
                {opt === value && (
                  <Ionicons name="checkmark" size={16} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
const ddStyles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111827',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    paddingHorizontal: 16,
    height: 52,
  },
  triggerText: { fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  menu: {
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2A3A',
  },
  optionSelected: { backgroundColor: '#0D1A33' },
  optionText: { fontSize: 14, color: '#A0AEC0' },
  optionTextSelected: { color: '#2563EB', fontWeight: '700' },
});

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionTitle({ icon, title }) {
  return (
    <View style={secStyles.row}>
      <Ionicons name={icon} size={18} color="#2563EB" />
      <Text style={secStyles.title}>{title}</Text>
    </View>
  );
}
const secStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
const RELEVANCE_OPTIONS = [
  'Extremely Relevant',
  'Very Relevant',
  'Somewhat Relevant',
  'Not Relevant',
];
const PACE_OPTIONS = ['Too Fast', 'Just Right', 'Too Slow'];

export default function SessionEvaluationScreen({ navigation, route }) {
  const session = route?.params?.session ?? {
    title: 'Advanced React Hooks',
    courseCode: 'REACT-2024-08',
    instructor: 'Jane Doe',
  };

  const [rating, setRating] = useState(5);
  const [checkboxes, setCheckboxes] = useState({
    clearComm: true,
    expertise: true,
    engaging: false,
  });
  const [relevance, setRelevance] = useState('Extremely Relevant');
  const [pace, setPace] = useState('Just Right');
  const [highlight, setHighlight] = useState('');
  const [recommend, setRecommend] = useState(true);
  const [suggestions, setSuggestions] = useState('');

  const toggleCheckbox = key =>
    setCheckboxes(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = () => {
    console.log('Feedback submitted');
    navigation.goBack();
  };

  const handleSaveDraft = () => {
    console.log('Draft saved');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1C" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Course info card ── */}
        <View style={styles.courseCard}>
          <View style={styles.courseIconBadge}>
            <Ionicons name="code-slash-outline" size={24} color="#2563EB" />
          </View>
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{session.title}</Text>
            <Text style={styles.courseCode}>{session.courseCode}</Text>
            <Text style={styles.courseInstructor}>
              Instructor: {session.instructor}
            </Text>
          </View>
        </View>

        {/* ── Trainer Effectiveness ── */}
        <View style={styles.section}>
          <SectionTitle icon="people-outline" title="Trainer Effectiveness" />
          <View style={styles.sectionCard}>
            <Text style={styles.fieldLabel}>OVERALL RATING</Text>
            <StarRating rating={rating} onChange={setRating} />
          </View>
          <View style={styles.checkboxGroup}>
            <CheckboxRow
              label="Clear communication"
              checked={checkboxes.clearComm}
              onChange={() => toggleCheckbox('clearComm')}
            />
            <CheckboxRow
              label="Subject expertise"
              checked={checkboxes.expertise}
              onChange={() => toggleCheckbox('expertise')}
            />
            <CheckboxRow
              label="Engaging delivery"
              checked={checkboxes.engaging}
              onChange={() => toggleCheckbox('engaging')}
            />
          </View>
        </View>

        {/* ── Session Quality & Content ── */}
        <View style={styles.section}>
          <SectionTitle
            icon="bar-chart-outline"
            title="Session Quality & Content"
          />
          <View style={styles.dropdownGroup}>
            <Text style={styles.fieldLabel}>Content Relevance</Text>
            <Dropdown
              value={relevance}
              options={RELEVANCE_OPTIONS}
              onSelect={setRelevance}
            />
            <Text style={styles.fieldLabel}>Delivery Pace</Text>
            <Dropdown value={pace} options={PACE_OPTIONS} onSelect={setPace} />
          </View>
        </View>

        {/* ── Most Valuable Part ── */}
        <View style={styles.section}>
          <SectionTitle icon="bulb-outline" title="Most Valuable Part" />
          <TextInput
            style={styles.textArea}
            placeholder="What was the highlight of this session for you?"
            placeholderTextColor="#4A5568"
            value={highlight}
            onChangeText={setHighlight}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* ── Additional Feedback ── */}
        <View style={styles.section}>
          <SectionTitle icon="chatbox-outline" title="Additional Feedback" />

          <Text style={styles.fieldLabel}>
            Would you recommend this session?
          </Text>
          <View style={styles.recommendRow}>
            <TouchableOpacity
              style={[
                styles.recommendBtn,
                recommend && styles.recommendBtnActive,
              ]}
              onPress={() => setRecommend(true)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.recommendBtnText,
                  recommend && styles.recommendBtnTextActive,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.recommendBtn,
                !recommend && styles.recommendBtnActive,
              ]}
              onPress={() => setRecommend(false)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.recommendBtnText,
                  !recommend && styles.recommendBtnTextActive,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>Suggestions for improvement</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Any other comments or suggestions?"
            placeholderTextColor="#4A5568"
            value={suggestions}
            onChangeText={setSuggestions}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* ── Submit ── */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Ionicons name="send" size={18} color="#FFFFFF" />
          <Text style={styles.submitBtnText}>Submit Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.draftBtn} onPress={handleSaveDraft}>
          <Text style={styles.draftBtnText}>Save Draft</Text>
        </TouchableOpacity>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A0F1C' },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 24,
  },

  // Course card
  courseCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    padding: 16,
    gap: 14,
  },
  courseIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#0D1626',
    borderWidth: 1,
    borderColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseInfo: { flex: 1, gap: 4 },
  courseTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 21,
  },
  courseCode: { fontSize: 12, color: '#2563EB', fontWeight: '600' },
  courseInstructor: { fontSize: 12, color: '#718096' },

  // Sections
  section: { gap: 14 },
  sectionCard: {
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    padding: 18,
    gap: 14,
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
    letterSpacing: 0.3,
    marginBottom: 2,
  },

  checkboxGroup: { gap: 10 },
  dropdownGroup: { gap: 10 },

  // Text area
  textArea: {
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#FFFFFF',
    minHeight: 100,
    lineHeight: 22,
  },

  // Recommend
  recommendRow: {
    flexDirection: 'row',
    gap: 12,
  },
  recommendBtn: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E2A3A',
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  recommendBtnText: { fontSize: 14, fontWeight: '600', color: '#718096' },
  recommendBtnTextActive: { color: '#FFFFFF' },

  // Submit
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 14,
    height: 56,
    gap: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  draftBtn: { alignItems: 'center', paddingVertical: 8 },
  draftBtnText: { fontSize: 14, color: '#2563EB', fontWeight: '600' },
});
