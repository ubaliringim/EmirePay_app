import { Modal, View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { Colors, Rounded, Spacing } from '../../constants/colors';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ visible, onClose, title, children }: BottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <Pressable style={styles.content} onPress={() => {}}>
            <View style={styles.handle} />
            {title && (
              <View style={styles.header}>
                <View style={styles.titleContainer}>
                  <View style={{ width: 24 }} />
                  <View style={styles.titleCenter}>
                    {typeof title === 'string' ? (
                      <View style={styles.titlePlaceholder} />
                    ) : title}
                  </View>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <X size={24} color={Colors.ink} />
                  </TouchableOpacity>
                </View>
                  </View>
            )}
            {children}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: Colors.canvas,
    borderTopLeftRadius: Rounded.xl,
    borderTopRightRadius: Rounded.xl,
    paddingBottom: Spacing['3xl'],
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.mute,
    borderRadius: Rounded.full,
    alignSelf: 'center',
    marginTop: Spacing.sm,
  },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.canvasSoft,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleCenter: {
    flex: 1,
    alignItems: 'center',
  },
  titlePlaceholder: {
    width: 100,
    height: 20,
  },
  closeButton: {
    padding: Spacing.xs,
  },
});
