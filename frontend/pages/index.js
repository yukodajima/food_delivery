import {
  Alert,
  Button,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from 'reactstrap';
import RestaulantList from './components/RestaulantsList';
import { useState } from 'react';

const index = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="container-fluid">
      <Row
        style={{
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 100,
          paddingRight: 100,
        }}
      >
        <Col>
          <div className="search">
            <InputGroup>
              <InputGroupText>探す</InputGroupText>
              <Input
                placeholder="レストラン名を入力してください"
                onChange={(e) => setQuery(e.target.value.toLocaleLowerCase())}
              ></Input>
            </InputGroup>
          </div>
        </Col>
      </Row>
      {/* ↓↓queryをpropsとして渡す */}
      <RestaulantList search={query} />
      <style jsx>
        {`
          .search {
            margin-top: 20px;
            margin-bottom: 20px;
            width: 500px;
          }
        `}
      </style>
    </div>
  );
};

export default index;
