import React from 'react';
import { FlatList, TouchableOpacity, RefreshControl, Image, Alert, } from 'react-native';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { Container, Content, Card, CardItem, Body, Text, Button, H1, Right, Left, H3, List, ListItem, Icon, Form, Item, Picker, Label, Input, Spinner, Accordion} from 'native-base';
//import DialogInput from 'react-native-dialog-input';
import Modal from 'react-native-modal';
import Messages from './Messages';
import Header from './Header';
import Spacer from './Spacer';
import Error from './Error';
import {getVehicle, getVehicleHistory, addCertifiedPart} from '../actions/blockchain';
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
          partType:'',
          partSN:'',
          partMech:'Dom Raymond',
          loading:false
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
                let his = JSON.parse(r.data.result);
                this.setState({history: his});
            }).catch((err) => {
                console.log(`Error: ${err}`);
                return this.props.setError(err);
            });
            let veh = JSON.parse(r.data.result);

            
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

  addPart = () => {

    let timestamp = Math.floor(Date.now() / 1000).toString();
    let message = {
        "chaincode": "dmvcc",
        "channel": "mychannel",
        "method": "addPart",
        "args": [
            this.state.vin, // vin of the vehicle
            this.state.partType, // name of the part
            this.state.partSN, // serial number of the part
            this.state.partMech, // the name of the person that assembled the part to the vehicle
            timestamp// the unix timestamp of the time that the part was assembled to the vehicle
        ],
        "chaincodeVer": "v1"
    }
    
    this.setState({loading:true});
    addCertifiedPart(message).then((r)=>{
        this.setState({nm:false});
        this.setState({loading:false});
        this._onRefresh();
    });
  }

  openWallet(){
    //Linking.openURL('https://ioswallet-gse00015026.uscom-east-1.oraclecloud.com/loadPass?gate=123&passenger=Saravana&date=8/23');
    this.setState({nm:false});
  }

  render() {
    var parts = null;
    var owners = [];
    if (!this.state.car) {

        this.fetchCar();
        return <Error title='loading' content='data' />;
    }else{
        let m = this.state.car.parts;
        let o = this.state.history;

        //console.log(this.state.car);
        
        if(m){
            parts = m.slice(0).reverse().map(item => (
                <ListItem key={item.timestamp} rightIcon={{ style: { opacity: 0 } }}>
                    <Text>Date: {new Date(item.timestamp).toDateString()}{"\n"}Part: {item.name}{"\n"}SN: {item.serialNumber}{"\n"}Assembler: {item.assembler}</Text>
                </ListItem>
            ));
        }
        if(o){
            o.slice(0).reverse().forEach(item => owners.push({title: item['Timestamp'], content: JSON.stringify(item['Value'])}));
            console.log(o);
        }
        
    }
    
    
    
      return (
        <Container style={{backgroundColor:'#eff0f4'}}>
          <Content padder
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          >
            <Image source={{ uri: this.state.car.image }} style={{ height: 200, width: null, flex: 1 }} />
    
            <H1 style={{padding: 20, fontStyle: 'italic', color: '#455d7a', fontWeight:'900'}}>
                {this.state.car.make + " " +this.state.car.model}
            </H1>
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
            <Card>
              <CardItem header bordered>
                <Text style={{fontWeight:'bold', color:'#455d7a'}}>Blockchain Transactions</Text>
              </CardItem>
              <CardItem>
                <Content>
                <Accordion dataArray={owners} expanded={0}/>
                </Content>
              </CardItem>
            </Card>

            
    
    
            <Spacer size={20} />
          </Content>
          <Modal 
            isVisible={this.state.nm}
            onBackdropPress={() => this.setState({ nm: false })}
            onSwipe={() => this.setState({ isVisible: false })}
            swipeDirection="down"
            animationIn="slideInUp"
            animationOut="slideOutDown"
          >
          {this.state.loading ? <Card><Spinner color='blue' /></Card> :
          <Card>
            <CardItem header >
                <H3 style={{fontWeight:'bold', color:'#455d7a'}}>Add Certified Part</H3>
            </CardItem>
            <CardItem>
                <Form style={{flex:1}}>
                <Item stackedLabel>
                  <Label>VIN:</Label>
                  <Input disabled placeholder={this.state.car.vin}/>
                </Item>
                <Item picker>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        placeholder="Please select part"
                        placeholderStyle={{color:'#264e86'}}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.partType}
                        onValueChange={(e)=>this.setState({partType:e})}
                    >
                        <Picker.Item label="Airbag" value="bugattiAirbag" />
                        <Picker.Item label="Brake Pads" value="bugattiBreakPads" />
                        <Picker.Item label="Tires" value="bugattiTires" />
                        <Picker.Item label="Oil Filter" value="bugattiOilFilter" />
                        <Picker.Item label="Fluids" value="bugattiOilChange" />
                    </Picker>
                </Item>
                <Item stackedLabel>
                  <Label>Serial Number:</Label>
                  <Input onChangeText={(e)=>this.setState({partSN: e})}/>
                </Item>
                <Item stackedLabel last>
                  <Label>Assembler:</Label>
                  <Input onChangeText={(e)=>this.setState({partMech:e})} placeholder="Dom Raymond"/>
                </Item>
              </Form>
            </CardItem>
            <CardItem footer button onPress={() => this.addPart()}>
                <Right><H3 style={{color:'#264e86'}}>Submit</H3></Right>
            </CardItem>
        </Card>}
      </Modal>
        </Container>

      );
  }
}

export default Vehicle;
