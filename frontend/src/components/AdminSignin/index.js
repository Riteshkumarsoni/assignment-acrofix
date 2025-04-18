import {Component} from 'react'
import { Navigate } from 'react-router-dom'
import Header from '../Header'
import Cookies from 'js-cookie'
import { withNavigation } from '../WithNavigation'
import './index.css'

class AdminSignin extends Component{
    state = {useremail: '', password: '', error_msg: ''}

    onLoginSuccess = (jwtToken) => {
        Cookies.set('jwt_token', jwtToken, {expires: 1})
        this.props.navigate("/admin/dashboard")
    }

    onChangeEmail = (event) => {
        this.setState({useremail: event.target.value})
    }

    onChangepassword = (event) => {
        this.setState({password: event.target.value})
    }

    onSubmitForm = async (event) => {
        event.preventDefault()
        const {useremail, password} = this.state
        const userDetails = {useremail: useremail, userpassword: password}
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userDetails)
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/admin-login`, options)
        const data = await response.json()
        if(response.ok){
            this.onLoginSuccess(data.jwtToken)
        }
        else{
            this.setState({error_msg: data.msg})
        }
    }

    render(){
        const {useremail,password,error_msg} = this.state
        const jwtToken = Cookies.get('jwt_token')
        if(jwtToken !== undefined){
            return <Navigate to="/admin/dashboard" />
        }
        return(
            <div className='admin-signin-bg-container'>
                <Header />
                <div>
                    <div className='admin-signin-card-container'>
                        <h1 className='admin-signin-heading'>Admin Sign-In</h1>
                        <form className='form-container' onSubmit={this.onSubmitForm}>
                            <input type="text" className='inputEl' placeholder='Email' value={useremail} onChange={this.onChangeEmail}/>
                            <input type="text" className='inputEl' placeholder='password' value={password} onChange={this.onChangepassword} />
                            <button type="submit" className='signin-btn'>Sign In</button>
                        </form>
                        {error_msg.length > 0 && <p className='error-msg'>**{error_msg}</p>}
                    </div>
                </div>
            </div>
        )
    }
}

export default withNavigation(AdminSignin)