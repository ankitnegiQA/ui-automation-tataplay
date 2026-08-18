class ProductApi {
    constructor(request)
    {
        this.request=request;
        this.baseUrl = "https://api.practicesoftwaretesting.com";
    }

    async getProducts(perPage = 5)
    {
        return this.request.get(`${this.baseUrl}/products`,{
            params : {
                per_page: perPage
            },
        });
    }

    async getFirstProductId()
    {
        const response = await this.getProducts(1);
        const body = await response.json();
        return body.data[0].id;
    }
}


module.exports = {ProductApi};