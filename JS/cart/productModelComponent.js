let myProductModal = '';
export default{
    props:['item'],
    methods: {
        addToCart(){           
            this.$emit('addToCart',this.item)
        }
    },
    mounted(){
        myProductModal = new bootstrap.Modal(this.$refs.productModal);
    },
    template:`<div id="productModal" ref="productModal" class="modal hide" tabindex="-1" aria-labelledby="productModalLabel"
    aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content border-0">
            <div class="modal-header bg-dark text-white">
                <h5 id="productModalLabel" class="modal-title">
                <span>商品詳細</span>
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-4">
                        <div class="mb-2">
                            <div class="mb-3">
                                <h5>主要圖片</h5>
                                <img class="img-fluid" :src="item.imageUrl">
                                <h5 class="mt-3">更多圖片</h5>
                                <template v-for="(img, key) in item.imagesUrl" :key="'image_' + key">
                                    <img class="img-fluid w-50" :src="img">
                                </template>
                            </div>
                        </div>
                    </div>
                <div class="col-sm-8">
                    <div class="mb-3">
                        <span class="badge bg-primary mb-1">{{ item.category }}</span>
                        <h5 class="card-title">{{ item.title }}</h5>
                    </div>
                    <div class="row">
                        <div class="mb-3 col-md-6">
                            <label for="origin_price" class="form-label"><del>原價$ {{ item.origin_price }}</del></label>
                        </div>
                        <div class="mb-3 col-md-6">
                            <label for="price" class="form-label">售價$ {{ item.price }}</label>
                        </div>
                    </div>
                    <hr>
                    <div class="mb-3">
                        <h5>產品描述</h5>
                        {{ item.description }}
                    </div>
                    <div class="mb-3">
                        <h5>產品說明</h5>
                        {{ item.content }}
                    </div>
                    <div class="mb-3">
                    </div>
                </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                取消
                </button>
                <button type="button" class="btn btn-primary" @click="addToCart(item)">
                加入購物車
                </button>
            </div>
            </div>
        </div>
    </div>`
}