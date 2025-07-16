import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const CalculatorScreen = ({ navigation }: any) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState('');

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setCalculationHistory('');
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setCalculationHistory(`${inputValue} ${nextOperation}`);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(newValue);
      setCalculationHistory(`${currentValue} ${operation} ${inputValue} = ${newValue} ${nextOperation}`);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, op: string): number => {
    switch (op) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return firstValue / secondValue;
      default: return secondValue;
    }
  };

  const calculateResult = () => {
    if (!previousValue || !operation) return;

    const inputValue = parseFloat(display);
    const newValue = calculate(previousValue, inputValue, operation);
    setDisplay(String(newValue));
    setCalculationHistory(`${previousValue} ${operation} ${inputValue} = ${newValue}`);
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const percentage = () => {
    const currentValue = parseFloat(display);
    const newValue = currentValue / 100;
    setDisplay(String(newValue));
    setCalculationHistory(`${currentValue}% = ${newValue}`);
  };

  const toggleSign = () => {
    const newValue = parseFloat(display) * -1;
    setDisplay(String(newValue));
    setCalculationHistory(`${parseFloat(display)} → ${newValue}`);
  };

  const deleteLastDigit = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const Button = ({ title, onPress, style, textStyle }: any) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calculator</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.display}>
        {calculationHistory ? (
          <Text style={styles.calculationHistory}>{calculationHistory}</Text>
        ) : null}
        <Text style={styles.displayText}>{display}</Text>
      </View>

      <View style={styles.buttons}>
        <View style={styles.row}>
          <Button title="AC" onPress={clearAll} style={styles.functionButton} />
          <Button title="X" onPress={deleteLastDigit} style={styles.functionButton} />
          <Button title="%" onPress={percentage} style={styles.functionButton} />
          <Button title="÷" onPress={() => performOperation('÷')} style={styles.operatorButton} />
        </View>
        
        <View style={styles.row}>
          <Button title="7" onPress={() => inputDigit('7')} />
          <Button title="8" onPress={() => inputDigit('8')} />
          <Button title="9" onPress={() => inputDigit('9')} />
          <Button title="×" onPress={() => performOperation('×')} style={styles.operatorButton} />
        </View>
        
        <View style={styles.row}>
          <Button title="4" onPress={() => inputDigit('4')} />
          <Button title="5" onPress={() => inputDigit('5')} />
          <Button title="6" onPress={() => inputDigit('6')} />
          <Button title="-" onPress={() => performOperation('-')} style={styles.operatorButton} />
        </View>
        
        <View style={styles.row}>
          <Button title="1" onPress={() => inputDigit('1')} />
          <Button title="2" onPress={() => inputDigit('2')} />
          <Button title="3" onPress={() => inputDigit('3')} />
          <Button title="+" onPress={() => performOperation('+')} style={styles.operatorButton} />
        </View>
        
        <View style={styles.row}>
          <Button title="0" onPress={() => inputDigit('0')} style={styles.zeroButton} />
          <Button title="." onPress={inputDecimal} />
          <Button title="=" onPress={calculateResult} style={styles.operatorButton} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  display: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 20,
  },
  calculationHistory: {
    color: '#666',
    fontSize: 24,
    fontWeight: '400',
    textAlign: 'right',
    marginBottom: 10,
  },
  displayText: {
    color: '#333',
    fontSize: 80,
    fontWeight: '300',
    textAlign: 'right',
  },
  buttons: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  button: {
    flex: 1,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#333',
    fontSize: 28,
    fontWeight: '400',
  },
  functionButton: {
    backgroundColor: '#e0e0e0',
  },
  functionButtonText: {
    color: '#333',
  },
  operatorButton: {
    backgroundColor: '#ff9500',
  },
  zeroButton: {
    flex: 2,
    alignItems: 'flex-start',
    paddingLeft: 25,
  },
});

export default CalculatorScreen; 