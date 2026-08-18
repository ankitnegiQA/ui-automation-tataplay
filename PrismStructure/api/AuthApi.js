class AuthApi{
    constructor(request)
    {
        this.request=request;
        this.baseUrl = 'https://api.practicesoftwaretesting.com';
    }

    async register(payload)
    {
        return this.request.post(`${this.baseUrl}/users/register`,{
            data: payload,
        });
    }

    async login(email,password)
    {
        return this.request.post(`${this.baseUrl}/users/login`,{
            data : {email,password},
        });
    }

    authHeaders(token){
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }
}

module.exports = {AuthApi};