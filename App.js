import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import { Card } from 'react-native-paper';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false,
      converting: 0,
      input: '',
      output: '',
    };
    this.updateIndex = this.updateIndex.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.convert = this.convert.bind(this);
    this.loadFonts = this.loadFonts.bind(this);
  }

  convert() {
    if (this.state.input != null && this.state.input.length != 0) {
      let out;
      if (this.state.converting === 0) {
        out = this.state.input * (9 / 5) + 32;
      } else {
        out = (this.state.input - 32) * (5 / 9);
      }
      out = out.toString();
      let i = out.indexOf('.');
      if (i != -1 && out.length > i + 2) {
        out = out.substr(0, i + 3);
      }
      this.setState({ output: out });
    }
  }

  async loadFonts() {
    await Font.loadAsync({
      'open-sans-semibold': require('./assets/Fonts/Open_Sans/OpenSans-SemiBold.ttf'),
      'open-sans': require('./assets/Fonts/Open_Sans/OpenSans-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });
  }
  componentDidMount() {
    this.loadFonts();
  }

  updateIndex(ind) {
    this.setState((state) => {
      if (state.converting != ind) {
        return { converting: ind, input: state.output, output: state.input };
      }
    });
  }

  handleTextChange(e) {
    let text = '';
    for (let i = 0; i < e.length; i++) {
      if (!isNaN(parseInt(e.charAt(i)))) {
        text += e.charAt(i);
      } else if (e.charAt(i) == '.' && text.indexOf('.') == -1) {
        text += e.charAt(i);
      }
    }

    this.setState({ input: text });
  }

  render() {
    let color;
    let colorStr;
    let color2;
    let placeholderText;
    let convertFrom;
    let convertTo;

    if (this.state.converting === 0) {
      color = styles.c;
      colorStr = '#6D8AD6';
      color2 = styles.f;
      placeholderText = 'Celcius Temperature';
      convertFrom = '°C';
      convertTo = '°F';
    } else {
      color = styles.f;
      colorStr = '#EB5D5D';
      color2 = styles.c;
      placeholderText = 'Farenheit Temperature';
      convertFrom = '°F';
      convertTo = '°C';
    }

    if (this.state.fontLoaded) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text
              style={[styles.headerText, { fontFamily: 'open-sans-semibold' }]}>
              Temperature Converter
            </Text>
          </View>
          <View style={styles.main}>
            <View>
              <CustomButtonGroup
                selectedIndex={this.state.converting}
                textStyle={styles.loadedFont}
                onPress={this.updateIndex}
              />
            </View>
            <Card style={[color, styles.card]}>
              <View style={styles.cardFlex}>
                <TextInput
                  style={[
                    { fontSize: 17, textAlign: 'center' },
                    styles.loadedFont,
                  ]}
                  placeholder={placeholderText}
                  value={this.state.input}
                  onChangeText={this.handleTextChange}
                />
                <CustomText> {convertFrom} </CustomText>
              </View>
            </Card>
            <Card style={[color2, styles.card]}>
              <View style={styles.cardFlex}>
                <CustomText>{this.state.output}</CustomText>
                <CustomText style={{ width: 30, paddingLeft: 7 }}>
                  {convertTo}
                </CustomText>
              </View>
            </Card>
            <CustomButton
              textStyle={styles.loadedFont}
              text="Convert"
              style={[styles.convertButton, color]}
              onPress={this.convert}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Temperature Converter</Text>
          </View>
          <Text> hi</Text>
          <View style={styles.main}>
            <View>
              <CustomButtonGroup
                selectedIndex={this.state.converting}
                textStyle={styles.loadedFont}
                onPress={this.updateIndex}
              />
            </View>
            <Card style={[color, styles.card]}>
              <View style={styles.cardFlex}>
                <TextInput
                  style={[
                    { fontSize: 17, textAlign: 'center' },
                    styles.loadedFont,
                  ]}
                  placeholder={placeholderText}
                  value={this.state.input}
                  onChangeText={this.handleTextChange}
                />
                <CustomText> {convertFrom} </CustomText>
              </View>
            </Card>
            <Card style={[color2, styles.card]}>
              <View style={styles.cardFlex}>
                <CustomText>{this.state.output}</CustomText>
                <CustomText style={{ width: 30, paddingLeft: 7 }}>
                  {convertTo}
                </CustomText>
              </View>
            </Card>
            <CustomButton
              textStyle={styles.loadedFont}
              text="Convert"
              style={[styles.convertButton, color]}
              onPress={this.convert}
            />
          </View>
        </View>
      );
    }
  }
}

const CustomText = (props) => {
  return (
    <Text style={[styles.loadedFont, props.style, { fontSize: 17 }]}>
      {props.children}
    </Text>
  );
};

const CustomButton = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={props.style}>
        <CustomText style={props.textStyle}>{props.text}</CustomText>
      </View>
    </TouchableOpacity>
  );
};

const CustomGroupButton = (props) => {
  const handlePress = function (event) {
    props.onPress(props.ind);
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={props.style}>
        <CustomText style={props.textStyle}>{props.text}</CustomText>
      </View>
    </TouchableOpacity>
  );
};

const CustomButtonGroup = (props) => {
  let button0Style;
  let button1Style;
  if (props.selectedIndex === 0) {
    button0Style = [styles.selectedButton, styles.c, styles.left];
    button1Style = [
      styles.notSelectedButton,
      styles.right,
      { backgroundColor: '#E5E5E5' },
    ];
  } else {
    button0Style = [
      styles.notSelectedButton,
      styles.left,
      { backgroundColor: '#E5E5E5' },
    ];
    button1Style = [styles.selectedButton, styles.f, styles.right];
  }
  return (
    <View style={styles.buttonGroup}>
      <CustomGroupButton
        onPress={props.onPress}
        style={button0Style}
        textStyle={props.textStyle}
        text={'°C to °F'}
        ind={0}
      />
      <CustomGroupButton
        onPress={props.onPress}
        textStyle={props.textStyle}
        style={button1Style}
        text={'°F to °C'}
        ind={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5E5E5',
    height: '100%',
  },
  header: {
    height: 40,
    position: 'absolute',
    top: Constants.statusBarHeight,
    width: '100%',
    backgroundColor: '#CCCACA',
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: 17,
    width: '100%',
    height: '100%',
    paddingLeft: 10,
    paddingTop: 10,
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  card: {
    borderColor: '#000000',
    borderWidth: '1px',
    borderStyle: 'solid',
    height: 90,
    marginBottom: 30,
    overflow: 'visible',
  },
  cardFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  f: {
    backgroundColor: '#EB5D5D',
  },
  c: {
    backgroundColor: '#6D8AD6',
  },
  left: {
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    height: 36,
    width: 80,
  },
  right: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    height: 36,
    width: 80,
  },
  convertButton: {
    borderColor: '#000000',
    borderWidth: '1px',
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
    borderRadius: 10,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 30,
  },
  selectedButton: {
    width: 72,
    borderColor: '#000000',
    borderWidth: '1px',
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
  },
  notSelectedButton: {
    width: 72,
    borderColor: '#000000',
    borderWidth: '1px',
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 30,
  },
  loadedFont: {
    fontStyle: 'open-sans',
  },
});
