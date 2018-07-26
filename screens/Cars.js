import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { Container, Content, Card, CardItem, Body, Text, Button, H1 } from 'native-base';
//import { Actions } from 'react-native-router-flux';
//import { SearchBar } from 'react-native-elements';
import Loading from './Loading';
import Error from './Error';
import Header from './Header';
import Spacer from './Spacer';
import { NavigationActions } from 'react-navigation';

const ol = 0;
class CarListing extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    cars: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    reFetch: PropTypes.func,
  }

  static defaultProps = {
    error: null,
    reFetch: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      carsSearch: this.props.cars,
      token: null,
      refreshing: false
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
    return this.props.getCars()
      .then(() => this.props.getMeals())
      .catch((err) => {
        console.log(`Error: ${err}`);
        return this.props.setError(err);
      });
  }

  changeText = (e) =>{
    var nrs = [];

      this.props.cars.forEach((r)=>{
        var isIngredient = false;
        e.toUpperCase().split(" ").forEach((i)=>{
          //console.log(r.ingredients);
          if(i==="") isIngredient = true;
          else if(r.ingredients.toString().toUpperCase().includes(i.toUpperCase())){
            isIngredient = true;
          }else if(!r.ingredients.toString().toUpperCase().includes(i.toUpperCase())){
            isIngredient=false;
            return;
          }
        });
        if(isIngredient && this.state.carsSearch.length<11) {
          //console.log()
          if(this.state.carsSearch[0] === 'poop') nrs.pop('poop');
          nrs.push(r);
        }else if(!isIngredient && this.state.carsSearch.includes(r)) {
          //console.log()
          nrs.pop(r);
        }
      });
      this.setState({carsSearch:nrs});

      console.log(this.state.carsSearch);
    
    if(!e.length){
      this.setState({carsSearch: this.props.cars});
    }
}

_onRefresh() {
  console.log('aasdadasd');
  this.setState({refreshing: true},()=>{
    console.log('r');
    this.props.reFetch().then(() => {
      this.setState({refreshing: false});
    });
  });
  
}
  
render(){
  // Loading
  if (this.props.loading) return <Loading />;
  
  // Error
  if (this.props.error) return <Error content={error} />;
  const keyExtractor = item => item.id;
  const onPress = item => NavigationActions.navigate({
    routeName: 'Car',
  
    params: {carId},
  }););
  

  return (
    <Container>
      <Content 
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)}
        />
      }
      padder>
      
      <Spacer size={25} />
      <H1>Cars</H1>
      <Spacer size={10} />
        <FlatList
          numColumns={2}
          data={this.state.carsSearch}
          extraData={
            this.state
          }
          renderItem={({ item }) => (
            <Card transparent style={{ paddingHorizontal: 4, maxWidth: "50%" }}>
              <CardItem cardBody>
                <TouchableOpacity onPress={() => onPress(item)} style={{ flex: 1 }}>
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      height: 150,
                      width: null,
                      flex: 1,
                      borderRadius: 5,
                    }}
                  />
                </TouchableOpacity>
              </CardItem>
              <CardItem cardBody>
                <Body>
                  <Spacer size={10} />
                  <Text style={{ fontWeight: '800' }}>{item.title}</Text>
                  <Spacer size={15} />
                  <Spacer size={5} />
                </Body>
              </CardItem>
            </Card>
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


export default CarListing;

/*
  import SearchBar from 'react-native-search-bar'

  <SearchBar
              ref='searchBar'
              placeholder='Search'
              onChangeText={()=>{}}
              onSearchButtonPress={()=>{}}
              onCancelButtonPress={()=>{}}
            />
*/