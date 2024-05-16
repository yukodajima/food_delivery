import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import Layout from './components/Layout';
import withDate from '../lib/apollo';
import AppContext from '../context/AppContext';
import Cookies from 'js-cookie';

class MyApp extends App {
  //クラスコンポーネントなのでuseStateが使えない為クラスコンポーネントで記述している
  // const [state, setState] = useState(null);

  //上のuseStateの記述と下の記述は同じ意味
  state = {
    user: null,
    cart: { items: [], total: 0 },
  };
  setUser = (user) => {
    this.setState({ user });
  };

  //Reactが毎回レンダリングする度にすでにユーザーのクッキー情報が残っているかを確認する
  componentDidMount() {
    const token = Cookies.get('token'); //tokenの中にjwtが入っている
    const cart = Cookies.get('cart');
    console.log('cart:', cart);

    if (cart !== 'undefined' && typeof cart === 'string') {
      JSON.parse(cart).forEach((item) => {
        this.setState({
          cart: {
            items: JSON.parse(cart),
            total: (this.state.cart.total += item.price * item.quantity),
          },
        });
      });
    }

    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        if (!res.ok) {
          Cookies.remove('token');
          this.setState({ user: null });
          return null;
        }
        const user = await res.json();
        this.setUser(user); //ログイン
      });
    }
  }

  //カートへ商品の追加
  addItem = (item) => {
    let { items } = this.state.cart;
    const newItem = items.find((i) => i.id === item.id);
    console.log('newItem:', newItem);
    //以下新しい商品を追加するとき
    if (!newItem) {
      item.quantity = 1;
      //cartに追加する
      this.setState(
        {
          cart: {
            items: [...items, item],
            total: this.state.cart.total + item.price,
          },
        },
        () => Cookies.set('cart', this.state.cart.items)
      );
    }
    //すでに同じ商品がカートに入っている時
    else {
      this.setState({
        cart: {
          items: this.state.cart.items.map((item) =>
            item.id === newItem.id
              ? Object.assign({}, item, { quantity: item.quantity + 1 })
              : item
          ),
          total: this.state.cart.total + item.price,
        },
      });
      () => Cookies.set('cart', this.state.cart.items);
    }
  };

  //カートから商品を削除
  removeItem = (item) => {
    let { items } = this.state.cart;
    const newItem = items.find((i) => i.id === item.id);
    if (newItem.quantity > 1) {
      this.setState(
        {
          cart: {
            items: this.state.cart.items.map((item) =>
              item.id === newItem.id
                ? Object.assign({}, item, { quantity: item.quantity - 1 })
                : item
            ),
            total: this.state.cart.total + item.price,
          },
        },
        () => Cookies.set('cart', this.state.cart.items)
      );
    }
    //カートに入っている商品が１つの場合
    else {
      const items = [...this.state.cart.items];
      console.log('items:', items);
      const index = items.findIndex((i) => i.id === newItem.id);
      items.splice(index, 1);

      this.setState({
        cart: {
          items: items,
          total: this.state.cart.total - item.price,
        },
      });
      () => Cookies.set('cart', this.state.cart.items);
    }
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <AppContext.Provider
        //↓でいうthisはこのクラス（MyApp）を指す
        value={{
          user: this.state.user,
          cart: this.state.cart,
          setUser: this.setUser,
          addItem: this.addItem,
          removeItem: this.removeItem,
        }}
      >
        <>
          <Head>
            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
            />
          </Head>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </>
      </AppContext.Provider>
    );
  }
}

export default withDate(MyApp);
