import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  listModalContainer: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff', // Assuming a white background, adjust as needed.
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fieldsSection: {
    padding: 20,
  },
  validateSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  modalInputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalInputFieldTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalInputFieldDescription: {
    fontSize: 16,
    color: '#666',
  },
  modalSubmitButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalSubmitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default styles;
