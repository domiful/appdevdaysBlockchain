import React from 'react';
import { FlatList, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { Container, Content, Card, CardItem, Body, Text, Button, H1, Right, Left } from 'native-base';
import { SearchBar } from 'react-native-elements';
import Messages from './Messages';
import Header from './Header';
import Spacer from './Spacer';
import {listAllVehicles, listDealerVehicles} from '../actions/blockchain';

const navigateAction = NavigationActions.navigate({
  routeName: 'Car',
});

class Vehicles extends React.Component {
    static propTypes = {
        error: PropTypes.string,
        //cars: PropTypes.arrayOf(PropTypes.shape()).isRequired,
        reFetch: PropTypes.func,
      }
    
      static defaultProps = {
        error: null,
        reFetch: null,
      }

      static navigationOptions = {
        title: 'Vehicles',
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
          cars: [],
          //carsSearch: this.props.cars,
          token: null,
          refreshing: false,
          carSearch: [],

        };
    
      }
    
      componentDidMount = () => this.fetchCars();
    
      componentWillMount(){
        this.fetchCars();
        //registerForPushNotificationsAsync();
        //this._notificationSubscription = Notifications.addListener(this._handleNotification);
      }
    
      /**
        * Fetch Data from API, saving to Redux
        */
      fetchCars = () => {
        return listAllVehicles()
          .then((r)=>{
            let vehicles = JSON.parse(r.data.result);
            vehicles.forEach((vehicle)=>{
              if(vehicle.model==='2'){
                vehicle.image = 'http://img2.netcarshow.com/Bugatti-Chiron_2017_800x600_wallpaper_02.jpg';
                vehicle.model = 'chiron'
              }else if(vehicle.model==='veyron'){
                vehicle.image = 'https://imgct2.aeplcdn.com/img/800x600/car-data/big/bugatti-veyron-image-9621.png?v=27';
              }else if(vehicle.model==='c class'){
                vehicle.image = 'https://pictures.topspeed.com/IMG/crop/201802/2018-mercedes-benz-c-clas-27_800x0w.jpg';
              }else{
                vehicle.image = 'https://assets.bugatti.com/fileadmin/_processed_/sei/p54/se-image-5de90b6eb67ae1125554f4870d0498e1.jpg';
              }
            });
            this.setState({cars: vehicles});
          }).catch((err) => {
            console.log(`Error: ${err}`);
            return this.props.setError(err);
          });
      }
      
    
    _onRefresh() {
      console.log('aasdadasd');
      this.setState({refreshing: true},()=>{
        console.log('r');
        this.fetchCars().then(() => {
          this.setState({refreshing: false});
        });
      });
      
    }

    changeText = (e) =>{
        this.state.cars.forEach((c)=>{
          if(e.toUpperCase()===c.vin.toUpperCase()){
            let carFound = [];
            carFound.push(c);
            this.setState({carSearch:carFound});
          }else if(this.state.carSearch.length>0)this.setState({carSearch:[]});
          else this.setState({carSearch:[]});
        });
  }

  handleChange = (name, val) => {
    this.setState({
      ...this.state,
      [name]: val,
    });
  }

  render() {
    const keyExtractor = item => item.vin;
    const onPress = item => this.props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'Car',
      params: { vin: String(item.vin) },
    }));


    console.log(this.state.cars);

    return (
      <Container  style={{backgroundColor:'#eff0f4'}}>
        <Content 
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          padder>
          <SearchBar
            ref={search => this.search = search}
            lightTheme
            round
            containerStyle={{'padding': 0,'backgroundColor': 'transparent', 'borderTopWidth': 0, 'borderBottomWidth': 0 }}
            onChangeText={this.changeText}
            placeholder='Search'
            onClear={()=>{}}
            />
            <FlatList
              numColumns={1}
              data={this.state.cars}
              extraData={
                this.state.cars
              }
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => onPress(item)} style={{ flex: 1 }}>

                <Card transparent style={{ paddingHorizontal: 4}}>
                  <CardItem cardBody>
                      <Image
                        source={{ uri: item.image }}
                        style={{
                          height: 160,
                          width: 160,
                          flex: 1,
                          borderRadius: 5,
                        }}
                      />
                    <Body style={{paddingLeft:10}}>
                      <Spacer size={10} />
                      <Text style={{ fontWeight: '600' }}>Make: {item.make.toUpperCase()}</Text>
                      <Spacer size={10} />
                      <Text style={{ fontWeight: '600' }}>Model: {item.model.toUpperCase()}</Text>
                      <Spacer size={10} />
                      <Text style={{ fontWeight: '600' }}>Owner: {item.owner.toUpperCase()}</Text>
                      <Spacer size={15} />
                      <Spacer size={5} />
                    </Body>
                  </CardItem>

                </Card>
                </TouchableOpacity>

              )}
              keyExtractor={keyExtractor}
              refreshing={this.state.refreshing}
              onRefresh={console.log('aasdadasd')}
            />

          <Spacer size={20} />
        </Content>
      </Container>
    );
  }
}

export default Vehicles;