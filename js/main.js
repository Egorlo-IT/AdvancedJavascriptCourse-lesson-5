/*
    Все пункты выполняются с использованием Vue.js.
    1. Добавить методы и обработчики событий для поля поиска. Создать в объекте 
    данных поле searchLine и привязать к нему содержимое поля ввода. 
    На кнопку Искать добавить обработчик клика, вызывающий метод FilterGoods.
    2. Добавить корзину. В html-шаблон добавить разметку корзины. 
    Добавить в объект данных поле isVisibleCart, управляющее видимостью корзины.
    3. * Добавлять в .goods-list заглушку с текстом «Нет данных» в случае, 
    если список товаров пуст.
*/

const API =
  "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

const app = new Vue({
  el: "#app",
  data: {
    catalogUrl: "/catalogData.json",
    products: [],
    filterProducts: [],
    cartProducts: [],
    imgCatalog: "https://via.placeholder.com/200x150",
    searchLine: "",
    isVisibleCart: false,
    totalCart: 0,
  },
  methods: {
    async getJson(url) {
      try {
        const result = await fetch(url);
        return await result.json();
      } catch (error) {
        console.log(error);
      }
    },
    addProduct(product) {
      this.isVisibleCart = true;
      let result = this.cartProducts.filter(
        (item) => item.id_product === product.id_product
      );
      if (result.length === 0) {
        this.cartProducts.push({
          id_product: product.id_product,
          product_name: product.product_name,
          quantity: 1,
          price: product.price,
          total: product.price,
        });
      } else {
        this.cartProducts.forEach((item) => {
          if (item.id_product === product.id_product) {
            item.quantity++;
            item.total = item.price * item.quantity;
          }
        });
      }

      this.calcTotalCart();
    },
    removeProduct(product) {
      let result = this.cartProducts.filter(
        (item) => item.id_product === product.id_product
      );

      if (result[0].quantity !== 0) {
        result[0].quantity--;
        result[0].total = result[0].price * result[0].quantity;
        if (result[0].quantity === 0) {
          this.cartProducts = this.cartProducts.filter(
            (item) => item.id_product !== product.id_product
          );
        }
      }

      this.calcTotalCart();
    },

    filterGoods() {
      if (this.searchLine.trim() !== "") {
        this.filterProducts = this.products.filter((product) =>
          product.product_name
            .toLowerCase()
            .includes(this.searchLine.toLowerCase())
        );
      } else {
        this.filterProducts = this.products;
      }
    },
    calcTotalCart() {
      if (this.cartProducts[0]) {
        this.totalCart = this.cartProducts[0].total;
        this.cartProducts.reduce((previousValue, currentValue) => {
          this.totalCart = previousValue.total + currentValue.total;
        });
      }
    },
  },
  created() {
    this.getJson(`${API + this.catalogUrl}`).then((data) => {
      for (let el of data) {
        this.products.push(el);
      }
    });
    this.filterProducts = this.products;
  },
});
