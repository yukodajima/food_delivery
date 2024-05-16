import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Col, Row } from 'reactstrap';
import Cart from './components/Cart/index';
import CheckOutForm from './components/Checkout/CheckOutForm';

const checkout = () => {
  const stripePromise = loadStripe(
    'pk_test_51PARLMEXP5aa2VKRZR4M4jwasiDjG0xqeEw6NHGRVSnPXMSHsW4jNO043qGpojPvIuP8TZD0HBiABx3eKJ0bC1Jq00ym8jCpVY'
  );
  return (
    <Row>
      <Col style={{ paddingRight: 0 }} sm={{ size: 3, order: 1, offset: 2 }}>
        <h1 style={{ margin: 20, fontsize: 20, textAlign: 'center' }}>
          チェックアウト
        </h1>
        <Cart></Cart>
      </Col>
      <Col style={{ paddingLeft: 5 }} sm={{ size: 6, order: 2 }}>
        <Elements stripe={stripePromise}>
          <CheckOutForm />
        </Elements>
      </Col>
    </Row>
  );
};

export default checkout;
