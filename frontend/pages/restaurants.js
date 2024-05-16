import Link from 'next/link';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import Cart from './components/Cart';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
//graphQLを呼び出す
const GET_RESTAURANT_DISHES = gql`
  query ($id: ID!) {
    restaurant(id: $id) {
      id
      name
      dishes {
        id
        name
        description
        price
        image {
          url
        }
      }
    }
  }
`;

const Restaulants = (props) => {
  const appContext = useContext(AppContext);
  console.log('props:', props);

  const router = useRouter();
  //GraphQLを使うためのフックス。ここでAPIを叩く
  const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
    //下のqueryはRestaurantList/index.js内にある?id=${res.id}を指す
    variables: { id: router.query.id },
  });
  console.log('router.query.id:', router.query.id);
  console.log('data:', data);

  if (error) return 'レストランの読み込みに失敗しました。';

  if (loading) return <h1>読み込み中。。。</h1>;

  if (data) {
    const { restaurant } = data;
    return (
      <>
        <h1
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 100,
            paddingRight: 100,
          }}
        >
          {restaurant.name}
        </h1>
        <Row
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 100,
            paddingRight: 100,
          }}
        >
          {restaurant.dishes.map((dish) => {
            return (
              <Col xs="6" sm="4" key={dish.id} style={{ padding: 0 }}>
                <Card style={{ margin: '0 10px' }}>
                  <CardImg
                    src={`${process.env.NEXT_PUBLIC_API_URL}${dish.image.url}`}
                    top={true}
                    style={{ height: 250 }}
                  />
                  <CardBody>
                    <CardTitle>{dish.name} </CardTitle>
                    <CardTitle>{dish.description}</CardTitle>
                  </CardBody>
                  <div className="card-footer">
                    {/* 実際に飛ばされるのはas */}
                    <Button
                      outline
                      color="primary"
                      onClick={() => appContext.addItem(dish)}
                    >
                      + カートに入れる
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}

          <style jsx>
            {`
              a {
                color: white;
              }
              a: link {
                text-decoration: none;
                color: white;
              }
              .card-column: 3;
            `}
          </style>
          <div>
            <Cart xs="3" style={{ paddinng: 0 }} />
          </div>
        </Row>
      </>
    );
  } else {
    return <h1>レストランが見つかりませんでした</h1>;
  }
};

export default Restaulants;
