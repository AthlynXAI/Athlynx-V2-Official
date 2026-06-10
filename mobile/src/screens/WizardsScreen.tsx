import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const WIZARDS = [
  { id: 'agent', icon: '🤝', title: 'Agent Wizard', desc: 'Find & vet sports agents', color: '#22d3ee' },
  { id: 'lawyer', icon: '⚖️', title: 'Legal Advisor', desc: 'NIL compliance & contracts', color: '#a855f7' },
  { id: 'financial', icon: '💰', title: 'Financial Coach', desc: 'Money management & taxes', color: '#22c55e' },
  { id: 'scholarship', icon: '🎓', title: 'Scholarship Navigator', desc: 'NCAA rules & eligibility', color: '#f59e0b' },
  { id: 'scout', icon: '👀', title: 'Scout Simulator', desc: 'See through scout eyes', color: '#ef4444' },
  { id: 'transfer', icon: '🔄', title: 'Transfer Guide', desc: 'Portal navigation', color: '#3b82f6' },
  { id: 'life', icon: '💖', title: 'Life Coach', desc: 'Balance & wellness', color: '#ec4899' },
  { id: 'career', icon: '⚡', title: 'Career Transition', desc: 'Life after sports', color: '#8b5cf6' },
];

export default function WizardsScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Wizards</Text>
        <Text style={styles.subtitle}>8 AI advisors ready to help you succeed</Text>
        <View style={styles.poweredBy}>
          <Text style={styles.poweredText}>Athlynx AI</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {WIZARDS.map(wizard => (
          <TouchableOpacity 
            key={wizard.id} 
            style={styles.wizardCard}
            onPress={() => navigation.navigate('Chat', { wizard })}
          >
            <View style={[styles.iconCircle, { backgroundColor: wizard.color + '20' }]}>
              <Text style={styles.wizardIcon}>{wizard.icon}</Text>
            </View>
            <Text style={styles.wizardTitle}>{wizard.title}</Text>
            <Text style={styles.wizardDesc}>{wizard.desc}</Text>
            <View style={[styles.startBtn, { backgroundColor: wizard.color }]}>
              <Text style={styles.startBtnText}>Start Chat</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>How It Works</Text>
        <View style={styles.step}>
          <Text style={styles.stepNum}>1</Text>
          <Text style={styles.stepText}>Choose your AI wizard based on what you need help with</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNum}>2</Text>
          <Text style={styles.stepText}>Chat naturally - ask questions, get personalized advice</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNum}>3</Text>
          <Text style={styles.stepText}>Take action with confidence using AI-powered insights</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { padding: 20, alignItems: 'center', backgroundColor: '#1e293b' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
  poweredBy: { marginTop: 12, backgroundColor: '#0f172a', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  poweredText: { color: '#a855f7', fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10 },
  wizardCard: { width: '46%', backgroundColor: '#1e293b', borderRadius: 16, padding: 16, margin: '2%', alignItems: 'center' },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  wizardIcon: { fontSize: 28 },
  wizardTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  wizardDesc: { fontSize: 11, color: '#64748b', textAlign: 'center', marginTop: 4, marginBottom: 12 },
  startBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  startBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  footer: { padding: 20, marginTop: 10 },
  footerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  step: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#22d3ee', justifyContent: 'center', alignItems: 'center', color: '#0f172a', fontWeight: 'bold', textAlign: 'center', lineHeight: 28, marginRight: 12 },
  stepText: { flex: 1, color: '#94a3b8', fontSize: 14 },
});
