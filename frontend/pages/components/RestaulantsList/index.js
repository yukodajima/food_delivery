import Link from 'next/link';
import { Card, CardBody, CardImg, CardTitle, Col, Row } from 'reactstrap';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

//graphQLを呼び出す
const query = gql`
  {
    restaurants {
      id
      name
      descriptioin
      image {
        url
      }
    }
  }
`;

const RestaulantList = (props) => {
  //GraphQLを使うためのフックス。ここでAPIを叩く
  const { loading, error, data } = useQuery(query);

  if (error) return 'レストランの読み込みに失敗しました。';
  console.log('error:', error);

  if (loading) return <h1>読み込み中。。。</h1>;

  console.log('props:', props);
  if (data) {
    console.log('data:', data);
    const searchQuery = data.restaurants.filter((restaurant) => {
      return restaurant.name.toLowerCase().includes(props.search);
    });
    console.log('data.restaurants:', data.restaurants);
    console.log('searchQuery:2', searchQuery);

    return (
      <Row
        style={{
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 100,
          paddingRight: 100,
        }}
      >
        {searchQuery.map((res) => {
          return (
            <Col xs="6" sm="4" key={res.id}>
              <Card style={{ margin: '0 0.5rem 20px 0.5rem' }}>
                <CardImg
                  src={`${process.env.NEXT_PUBLIC_API_URL}${res.image[0].url}`}
                  top={true}
                  style={{ height: 250 }}
                />
                <CardBody>
                  <CardTitle>{res.name} </CardTitle>
                  <CardTitle>{res.description}</CardTitle>
                </CardBody>
                <div className="card-footer">
                  {/* 実際に飛ばされるのはas もっと見るを押すと各レストランのメニューページが表示 */}
                  <Link
                    as={`/restaurants/${res.id}`}
                    href={`/restaurants?id=${res.id}`}
                  >
                    <a className="btn btn-primary">もっと見る</a>
                  </Link>
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
      </Row>
    );
  } else {
    return <h1>レストランが見つかりませんでした</h1>;
  }
};

export default RestaulantList;
