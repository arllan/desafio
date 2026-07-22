import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCopilot, type TooltipProps } from 'react-native-copilot';

export function TourTooltip({ labels }: TooltipProps) {
  const { goToNext, goToPrev, stop, currentStep, isFirstStep, isLastStep } = useCopilot();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{currentStep?.text}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity onPress={stop} style={styles.skipButton}>
          <Text style={styles.skipText}>{labels?.skip ?? 'Pular'}</Text>
        </TouchableOpacity>

        <View style={styles.navButtons}>
          {!isFirstStep && (
            <TouchableOpacity onPress={goToPrev} style={styles.outlineButton}>
              <Text style={styles.outlineText}>{labels?.previous ?? 'Anterior'}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={isLastStep ? stop : goToNext}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryText}>
              {isLastStep ? (labels?.finish ?? 'Concluir') : (labels?.next ?? 'Próximo')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    minWidth: 260,
    maxWidth: 320,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
    color: '#1A1A1A',
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  skipText: {
    color: '#888888',
    fontSize: 13,
  },
  outlineButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F7931A',
  },
  outlineText: {
    color: '#F7931A',
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F7931A',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
