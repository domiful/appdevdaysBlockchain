import React from 'react';
import PropTypes from 'prop-types';
import { Container, Content, Form, Item, Label, Input, Text, Button } from 'native-base';
import Loading from './Loading';
import Messages from './Messages';
import Header from './Header';
import Spacer from './Spacer';
import { NavigationActions } from 'react-navigation';

const navigateAction = NavigationActions.navigate({
  routeName: 'Home',
});

class AuthScreen extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
  }

  static defaultProps = {
    error: null,
    member: {},
  }

  static navigationOptions = {
    title: 'Login',
    headerStyle: {
        backgroundColor: '#0074e4',
      },
      headerTintColor: '#eff0f4',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
  };

  constructor(props) {
    super(props);
    this.state = {
      email: (props.member && props.member.email) ? props.member.email : '',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (name, val) => {
    this.setState({
      ...this.state,
      [name]: val,
    });
  }

  handleSubmit = () => {
    //this.props.onFormSubmit(this.state)
    //  .then(() => Actions.tabbar())
    //  .catch(e => console.log(`Error: ${e}`));
    this.props.navigation.dispatch(navigateAction);
    if(this.state.email === "amy.marlin" && this.state.password === "Mobile1*"){
      //Actions.popTo('recipes');
    }
  }

  render() {
    const { loading, error } = this.props;

    // Loading
    if (loading) return <Loading />;

    return (
      <Container  style={{backgroundColor:'#eff0f4'}}>
        <Content padder>
          <Header
            title="Welcome back"
            content="Please use your email and password to login."
          />

          {error && <Messages message={error} />}

          <Form>
            <Item stackedLabel>
              <Label>Email</Label>
              <Input
                autoCapitalize="none"
                value={this.state.email}
                keyboardType="email-address"
                onChangeText={v => this.handleChange('email', v)}
              />
            </Item>
            <Item stackedLabel>
              <Label>Password</Label>
              <Input
                secureTextEntry
                onChangeText={v => this.handleChange('password', v)}
              />
            </Item>

            <Spacer size={20} />

            <Button block style={{backgroundColor:'#264e86'}} onPress={this.handleSubmit}>
              <Text>Login</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default AuthScreen;
