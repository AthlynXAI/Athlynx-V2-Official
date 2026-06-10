import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";

type Props = { children: React.ReactNode };
type State = { error: Error | null; info: string | null };

// Top-level boundary so a render-time JS error becomes a visible
// in-app screen instead of an Android "this app has a bug" system dialog.
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): State {
    return { error, info: null };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    this.setState({ error, info: info?.componentStack ?? null });
    try {
      console.error("[ErrorBoundary]", error?.message, info?.componentStack);
    } catch {}
  }

  reset = () => this.setState({ error: null, info: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <View style={styles.root}>
        <Text style={styles.title}>Something went wrong.</Text>
        <Text style={styles.subtitle}>
          We kept the app open instead of crashing. Tap retry to reload the screen.
        </Text>
        {__DEV__ ? (
          <ScrollView style={styles.box} contentContainerStyle={styles.boxInner}>
            <Text style={styles.errMsg}>{String(this.state.error?.message ?? this.state.error)}</Text>
            {this.state.info ? <Text style={styles.stack}>{this.state.info}</Text> : null}
          </ScrollView>
        ) : null}
        <Pressable style={styles.button} onPress={this.reset}>
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000000", padding: 24, justifyContent: "center", alignItems: "center" },
  title: { color: "#FFFFFF", fontSize: 28, fontWeight: "900", marginBottom: 16, textAlign: "center" },
  subtitle: { color: "#8BA3C7", fontSize: 14, marginBottom: 18, lineHeight: 20, textAlign: "center", maxWidth: 320 },
  box: {
    flex: 1,
    backgroundColor: "#000000",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1F1F1F",
    marginBottom: 16,
  },
  boxInner: { padding: 16 },
  errMsg: { color: "#FF4444", fontSize: 13, fontWeight: "700", marginBottom: 12 },
  stack: { color: "#8BA3C7", fontSize: 11, fontFamily: "monospace" },
  button: {
    backgroundColor: "#1F1F1F",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2F2F2F",
  },
  buttonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", textDecorationLine: "underline" },
});
