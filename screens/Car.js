import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import { Container, Content, Card, CardItem, Body, Left, Right, H3, List, ListItem, Text } from 'native-base';
import ErrorMessages from '../../constants/errors';
import Error from './Error';
import Spacer from './Spacer';

const CarView = ({
  error,
  cars,
  carId,
}) => {
  // Error
  if (error) return <Error content={error} />;

  // Get this Car from all cars
  let car = null;
  if (carId && cars) {
    car = cars.find(item => parseInt(item.id, 10) === parseInt(carId, 10));
    console.log(car);
  }

  // Car not found
  if (!car) return <Error content={ErrorMessages.car404} />;

  // Build Ingredients listing
  const ingredients = car.ingredients.map(item => (
    <ListItem key={item} rightIcon={{ style: { opacity: 0 } }}>
      <Text>{item}</Text>
    </ListItem>
  ));

  // Build Method listing
  const method = car.method.map(item => (
    <ListItem key={item} rightIcon={{ style: { opacity: 0 } }}>
      <Text>{item}</Text>
    </ListItem>
  ));

  return (
    <Container>
      <Content padder>
        <Image source={{ uri: car.image }} style={{ height: 200, width: null, flex: 1 }} />

        <Spacer size={25} />
        <H3>{car.title}</H3>
        <Spacer size={15} />

        <Card>
          <CardItem header bordered>
            <Text>Description</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Text>{car.body}</Text>
            </Body>
          </CardItem>
          <CardItem>
              <Left>
                  <Text>Yield:{"\n"}{car.yield}</Text>
              </Left>
              <Body>
                  <Text>Difficulty:{"\n"}{car.diff}</Text>
              </Body>
              <Right>
                <Text>Time:{"\n"}{car.time}</Text>
              </Right>
            </CardItem>
        </Card>

        <Card>
          <CardItem header bordered>
            <Text>Ingredients</Text>
          </CardItem>
          <CardItem>
            <Content>
              <List>
                {ingredients}
              </List>
            </Content>
          </CardItem>
        </Card>

        <Card>
          <CardItem header bordered>
            <Text>Instructions</Text>
          </CardItem>
          <CardItem>
            <List>
              {method} 
            </List>
          </CardItem>
        </Card>

        <Spacer size={20} />
      </Content>
    </Container>
  );
};

CarView.propTypes = {
  error: PropTypes.string,
  carId: PropTypes.string.isRequired,
  cars: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

CarView.defaultProps = {
  error: null,
};

export default CarView;
