"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const stripe = require("stripe")(
  "sk_test_51PARLMEXP5aa2VKRcnoC8Z8RuJ0PCwMgVpnIsK7Nca2fD01kQrIC7sVkx82FotQJ3tv7l9WLhm2jIiaejUhgmf2F00DORKCrRw"
);

module.exports = {
  //注文を作成する
  create: async (ctx) => {
    const { address, amount, dishes, token } = JDON.parse(ctx.request.body);
    const charge = await stripe.charges.create({
      amount: amount,
      currency: "jpy",
      source: token,
      description: `Order ${new Date()} by ${ctx.state.user._id}`,
    });

    const order = await strapi.services.order.create({
      user: ctx.state.user._id,
      charge_id: charge.id,
      amount: amount,
      address,
      dishes,
    });

    return order;
  },
};
