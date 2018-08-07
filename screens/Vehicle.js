import React from 'react';
import { FlatList, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { Container, Content, Card, CardItem, Body, Text, Button, H1, Right, Left, H3, List, ListItem, Icon, } from 'native-base';
//import DialogInput from 'react-native-dialog-input';
import Modal from 'react-native-modal';
import Messages from './Messages';
import Header from './Header';
import Spacer from './Spacer';
import Error from './Error';
import {getVehicle, getVehicleHistory} from '../actions/blockchain';
const navigateAction = NavigationActions.navigate({
  routeName: 'Home',
});

class Vehicle extends React.Component {
    static propTypes = {
        error: PropTypes.string,
        reFetch: PropTypes.func,
      }
    
      static defaultProps = {
        error: null,
        reFetch: null,
      }

      static navigationOptions = {
        title: 'Vehicle',
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
          car: [],
          history: [],
          nm: false,
          //carsSearch: this.props.cars,
          token: null,
          refreshing: false,
          vin: this.props.navigation.state.params.vin,
        };
    
      }
    
      componentDidMount = () => this.fetchCar();
    
      componentWillMount(){
        this.fetchCar();
        //registerForPushNotificationsAsync();
        //this._notificationSubscription = Notifications.addListener(this._handleNotification);
      }
    
      /**
        * Fetch Data from API, saving to Redux
        */
       fetchCar = () => {
        return getVehicle(this.state.vin)
          .then((r)=>{
            getVehicleHistory(this.state.vin)
            .then((r)=>{
                console.log(r);
                let his = JSON.parse(r.data.result);
                this.setState({history: his});
            }).catch((err) => {
                console.log(`Error: ${err}`);
                return this.props.setError(err);
            });
            console.log(r);
            let veh = JSON.parse(r.data.result);
            console.log(veh);

            
              if(veh.model==='2'){
                veh.image = 'http://img2.netcarshow.com/Bugatti-Chiron_2017_800x600_wallpaper_02.jpg';
                veh.model = 'chiron'
              }else if(veh.model==='veyron'){
                veh.image = 'https://imgct2.aeplcdn.com/img/800x600/car-data/big/bugatti-veyron-image-9621.png?v=27';
              }else if(veh.model==='c class'){
                veh.image = 'https://pictures.topspeed.com/IMG/crop/201802/2018-mercedes-benz-c-clas-27_800x0w.jpg';
              }else{
                veh.image = 'https://assets.bugatti.com/fileadmin/_processed_/sei/p54/se-image-5de90b6eb67ae1125554f4870d0498e1.jpg';
              }
            
            this.setState({car: veh});
          }).catch((err) => {
            console.log(`Error: ${err}`);
            return this.props.setError(err);
          });
      }
      
    
    _onRefresh() {
      this.setState({refreshing: true},()=>{
        console.log('r');
        this.fetchCar().then(() => {
          this.setState({refreshing: false});
        });
      });
      
    }

  handleChange = (name, val) => {
    this.setState({
      ...this.state,
      [name]: val,
    });
  }

  addNote = () => {

  }

  openWallet(){
    //Linking.openURL('https://ioswallet-gse00015026.uscom-east-1.oraclecloud.com/loadPass?gate=123&passenger=Saravana&date=8/23');
    this.setState({nm:false});
  }

  render() {
    var parts = null;
    var owners = null;
    if (!this.state.car) {

        this.fetchCar();
        return <Error title='loading' content='data' />;
    }else{
        let m = this.state.car.maintenanceLog;
        let o = this.state.history;

        //console.log(this.state.car);
        
        if(m){
            parts = m.map(item => (
                <ListItem key={item.timestamp} rightIcon={{ style: { opacity: 0 } }}>
                    <Text>Date: {new Date(item.timestamp).toDateString()}{"\n"}Message: {item.description}</Text>
                </ListItem>
            ));
        }
        if(o){
            owners = o.map(item => (
                <ListItem key={item['Timestamp']} rightIcon={{ style: { opacity: 0 } }}>
                <Text>Date: {new Date(item['Timestamp']).toDateString()}{"\n"}Owner: {item['Value']['owner']}</Text>
                </ListItem>
            ));
        }
        
    }
    
    
    
      return (
        <Container style={{backgroundColor:'#eff0f4'}}>
          <Content padder>
            <Image source={{ uri: this.state.car.image }} style={{ height: 200, width: null, flex: 1 }} />
    
            <Header
                title={this.state.car.make}
                content={this.state.car.model}
                style={{marginLeft:50}}
            />
            <Card>
              <CardItem header bordered >
                <Text style={{fontWeight:'bold', color:'#455d7a'}}>Information</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>VIN: {this.state.car.vin}</Text>
                </Body>
              </CardItem>
              <CardItem>
                  <Left>
                      <Text>Year:{"\n"}{this.state.car.year}</Text>
                  </Left>
                  <Body>
                      <Text>Mileage:{"\n"}{this.state.car.mileage}</Text>
                  </Body>
                  <Right>
                    <Text>Origin:{"\n"}{this.state.car.origin}</Text>
                  </Right>
                </CardItem>
            </Card>

            <Card>
              <CardItem header bordered>
                <Text style={{fontWeight:'bold', color:'#455d7a'}}>Owner Records</Text>
              </CardItem>
              <CardItem>
                <Content>
                  <List>{owners}</List>
                </Content>
              </CardItem>
            </Card>
    
            <Card>
              <CardItem header bordered >
                <Text style={{fontWeight:'bold', color:'#455d7a'}}>Certified Repair Log</Text>
                <Right>
                <Button iconRight transparent style={{padding:0, margin: 0}} onPress={()=>this.setState({nm: true})}>
                    <Icon name='create' style={{color:'#264e86'}}/>
                </Button>
                </Right>
              </CardItem>
              <CardItem>
                <Content>
                <List>
                    {parts}
                </List>
                </Content>
              </CardItem>
            </Card>

            
    
    
            <Spacer size={20} />
          </Content>
          <Modal isVisible={this.state.nm}>
      <Container>
          <Content>
          <Header
          title="Add Part"
          //content={this.state.car.model}
          style={{backgroundColor:"#0074e4", height: 200, textAlign:'center'}}
  />
            <Card  style={{marginTop:50, marginLeft: 10, marginRight:10}}>
              
              <CardItem button onPress={() => this.openWallet()}>
                <Body>
                <Image
                style={{width: "100%", height: 200}}
                source={{uri: 'https://cdn.dribbble.com/users/315048/screenshots/3710002/check.gif'}}
                  />
                </Body>
              </CardItem>
              <CardItem footer button onPress={() => this.openWallet()}>
                <Body>
                  <Text>CHECK IN!</Text>
                </Body>
              </CardItem>
              
            </Card>
          </Content>
          </Container>
      </Modal>
        </Container>

      );
  }
}

export default Vehicle;
