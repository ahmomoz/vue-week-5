import ProductModelComponent from './cart/productModelComponent.js'

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
    });
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    //validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});


let myProductModal = '';
const app = Vue.createApp({
    data() {
        return {
            products: [],  //產品列表
            cartList:[],   //購物車列表
            tempProduct:[],  
            tempCartList:[],
            totalPrice: 0,
            url: 'https://ec-course-api.hexschool.io/v2',
            path: "ahmomoz",
            isLoading: true, //Loading效果
            form:{           //送出訂單資訊用表格資料
                user:{
                    email:'',
                    name:'',
                    tel:'',
                    address:'',
                },
                message:''
            },
            createOrder: {},
            errors: {},
        }
    },
    methods: {
        getProductsList(){  // 取得產品資料
            this.isLoading = true;
            axios.get(`${this.url}/api/${this.path}/products/all`)
            .then(res=>{
                this.products = res.data.products;
                this.isLoading = false;
            })
            .catch(err=>{
                alert(err.response.data.message);
            })
        },
        getCartList(){  // 取得購物車產品資料
            this.isLoading = true;
            axios.get(`${this.url}/api/${this.path}/cart`)
            .then(res=>{
                this.cartList = res.data.data.carts;
                this.totalPrice = res.data.data.total;
                this.isLoading = false;
            })
            .catch(err=>{
                alert(err);
            })
        },
        openProductModal(product){      // 開啟Modal
            this.tempProduct = { ...product };
            myProductModal.show();
        },
        addToCart(product){     //加入購物車
            const item={
                "data": {
                    "product_id": product.id,
                    "qty": 1
                }
            }
            this.isLoading = true;
            axios.post(`${this.url}/api/${this.path}/cart`,item)
            .then(res=>{
                this.isLoading = false;
                alert("加入購物車成功");
                myProductModal.hide();
                this.getCartList();
            })
            .catch(err=>{
                alert(err.response.data.message);
            })
        },
        updateQty(product, event) {      //更新商品數量
            const newQty = parseInt(event.target.value, 10);
            const item={
                "data": {
                    "product_id": product.id,
                    "qty": newQty
                }
            }
            axios.put(`${this.url}/api/${this.path}/cart/${product.id}`,item)
            .then(res=>{
                myProductModal.hide();
                this.getCartList(); 
            })
            .catch(err=>{
                alert(err.response.data.message);
            })
        },
        deleteProduct(product){     //刪除某項產品
            this.isLoading = true;
            axios.delete(`${this.url}/api/${this.path}/cart/${product.id}`)
            .then(res=>{
                alert(res.data.message);
                this.getCartList();
                this.isLoading = false;
            })
            .catch(err=>{
                alert(err.response.data.message);
            })
        },
        deleteCart(){     //清空購物車
            axios.delete(`${this.url}/api/${this.path}/carts`)
            .then(res=>{
                alert(res.data.message);
                this.getCartList();
            })
            .catch(err=>{
                alert(err.response.data.message);
            })
        },
        addOrder(){    //送出訂單
            if(this.cartList.length>0 ){
                const item = this.form;
                this.isLoading = true;
                axios.post(`${this.url}/api/${this.path}/order`,{ data: item })
                .then(res=>{
                    this.isLoading = false;
                    alert("訂單送出成功");
                    this.getCartList();
                    this.cartList='';
                    this.form=
                    {
                        user:{
                            email:'',
                            name:'',
                            tel:'',
                            address:'',
                        },
                        message:''
                    };
                })
                .catch(err=>{
                    alert(err.response.data.message);
                    this.isLoading = false;
                })
            }else{
                alert("購物車不得為空")
            }
        },
        onSubmit(){
        }
    },
    mounted() {
        this.getProductsList();
        this.getCartList();
        myProductModal = new bootstrap.Modal(document.getElementById('productModal'));
    },
    components: {
        ProductModelComponent
    }
});
app.component('loading', VueLoading.Component);

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');