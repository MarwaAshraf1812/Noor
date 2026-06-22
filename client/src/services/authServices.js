import api from './api';

const authServices = {
    login(data){
        return api.post('/auth/login', data)
    },
    register(data){
        return api.post('/auth/register', data)
    },
    logout(){
        return api.post('/auth/logout')
    },
    me(){
        return api.get('/auth/me')
    },
    googleLogin(token, isRegister = false){
        return api.post('/auth/google', { token, isRegister })
    },
    updateProfile(data){
        return api.put('/auth/profile', data)
    },
};

export default authServices;