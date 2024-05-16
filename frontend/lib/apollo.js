import { HttpLink } from 'apollo-link-http';
import { withData } from 'next-apollo';

//この環境変数を当てることによってデプロイした時に正常にAPIのURLが当たるようになる
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

const config = {
  link: new HttpLink({
    uri: `${API_URL}/graphql`,
  }),
};

export default withData(config);
