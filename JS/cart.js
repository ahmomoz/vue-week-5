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
                
            })
            .catch(err=>{
                Swal.fire({
                    icon: "error",
                    title: err.response.data.message,
                });
            })
            .finally(()=>{
                this.isLoading = false;
            })
        },
        getCartList(){  // 取得購物車產品資料
            this.isLoading = true;
            axios.get(`${this.url}/api/${this.path}/cart`)
            .then(res=>{
                this.cartList = res.data.data.carts;
                this.totalPrice = res.data.data.total;
            })
            .catch(err=>{
                Swal.fire({
                    icon: "error",
                    title: err,
                });
            })
            .finally(()=>{
                this.isLoading = false;
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
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "成功加入購物車",
                    showConfirmButton: false,
                    timer: 700
                });
                myProductModal.hide();
                this.getCartList();
            })
            .catch(err=>{
                Swal.fire({
                    icon: "error",
                    title: err.response.data.message,
                });
            })
            .finally(()=>{
                this.isLoading = false;
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
                Swal.fire({
                    icon: "error",
                    title: err.response.data.message,
                });
            })
        },
        deleteProduct(product){     //刪除某項產品
            this.isLoading = true;
            axios.delete(`${this.url}/api/${this.path}/cart/${product.id}`)
            .then(res=>{
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "已刪除",
                    showConfirmButton: false,
                    timer: 700
                });
                this.getCartList();
            })
            .catch(err=>{
                Swal.fire({
                    icon: "error",
                    title: err.response.data.message,
                });
            })
            .finally(()=>{
                this.isLoading = false;
            })
        },
        deleteCart(){     //清空購物車
            Swal.fire({
                title: "確定要清空購物車嗎？",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes"
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`${this.url}/api/${this.path}/carts`)
                    .then(res=>{
                        Swal.fire({
                            title: "已清空購物車",
                            icon: "success"
                        });
                        this.getCartList();
                    })
                    .catch(err=>{
                        Swal.fire({
                            icon: "error",
                            title: err.response.data.message,
                        });
                    })
                }
            });
            
        },
        addOrder(){    //送出訂單
            if(this.cartList.length>0 ){
                const item = this.form;
                this.isLoading = true;
                axios.post(`${this.url}/api/${this.path}/order`,{ data: item })
                .then(res=>{
                    Swal.fire({
                        title: "訂單送出成功",
                        icon: "success"
                    });
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
                    Swal.fire({
                        icon: "error",
                        title: err.response.data.message,
                    });
                })
                .finally(()=>{
                    this.isLoading = false;
                })
            }else{
                Swal.fire({
                    icon: "error",
                    title: "購物車不得為空",
                });
            }
        },
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