import {Component} from 'react'
import { ClipLoader } from 'react-spinners'
import Cookies from 'js-cookie'
import Header from '../Header'
import OrderItem from '../OrderItem'
import { withNavigation } from '../WithNavigation'
import { BsArrowDown } from "react-icons/bs";
import './index.css'


const apiConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    in_progress: 'IN_PROGRESS',
    failure: 'FAILURE'
} 

class AdminDashboard extends Component{
    state = {statusmsg: '',orderId:'',status: 'Pending', productName: '', productPrice: '', ProductImg: '', successMsg: '', errorMsg: '', orderData: [], apiStatus: apiConstants.initial}

    componentDidMount(){
        this.getProductDetails()
    }

    getProductDetails = async () => {
        this.setState({apiStatus: apiConstants.in_progress})
        const jwtToken = Cookies.get('jwt_token')
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/show/allordered/product`, options)
        if(response.ok){
            const fetchedData = await response.json()
            const updatedData = fetchedData.map(eachItem => ({
                orderId: eachItem.order_id,
                productImgUrl: eachItem.product_img_url,
                status: eachItem.status,
                createdAt: eachItem.created_at
            }))
            this.setState({orderData: updatedData, apiStatus: apiConstants.success})
        }
        else{
            this.setState({apiStatus: apiConstants.failure})
        }
    }

    onChangeProductName = (event) => {
        this.setState({productName: event.target.value})
    }

    onChangeProductPrice = (event) => {
        this.setState({productPrice: event.target.value})
    }

    onChangeProductImg = (event) => {
        this.setState({ProductImg: event.target.value})
    }

    onChangeOrderId = (event) => {
        this.setState({orderId: event.target.value})
    }

    onChangeStatus = (event) => {
        this.setState({status: event.target.value})
    }

    onproductSubmit = async (event) => {
        event.preventDefault()
        const {productName, productPrice, ProductImg} = this.state
        const jwtToken = Cookies.get('jwt_token')
        const productData = {productName: productName, pricePerUnit: productPrice, productImgUrl: ProductImg}
        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/add-product`, options)
        const fetchedData = await response.json()
        if(response.ok){
            this.setState({successMsg: fetchedData.msg, errorMsg:''})
        }
        else{
            this.setState({errorMsg: fetchedData.msg, successMsg:''})
        }
    }

    changeStatusOfProduct = async (event) => {
        event.preventDefault()
        const {orderId,status} = this.state
        const statusDetails = {orderId: orderId, status: status}
        const jwtToken = Cookies.get('jwt_token')
        const options = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(statusDetails)
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/update-product`, options)
        const data = await response.json()
        this.setState({statusmsg: data.msg})
    }

    onLogoutClick = () => {
        Cookies.remove('jwt_token')
        this.props.navigate("/admin-signin")
    }

    renderSuccess = () => {
        const {orderData} = this.state
        return (
            <>
                <ol className='order-item-list-container'>
                    {orderData.map(eachItem => <OrderItem key={eachItem.orderId} itemDetails={eachItem} />)}
                </ol>
            </>
        )
    }
    
    renderFailure = () => (
        <div className='failure-container'>
            <img src="https://res.cloudinary.com/dh8g9mloe/image/upload/v1743873558/GithubVisualizer/lxxrvrghrfmad5qfbdgv.png" alt="failure" className='failure-img' />
        </div>
    )

    renderInProgress = () => (
        <div className='loader-container'>
            <ClipLoader height={50} width={50} color="#bh125b" />
        </div>
    )

    renderSwitchOperation = () => {
        const {apiStatus} = this.state
        switch(apiStatus){
            case apiConstants.success:
                return this.renderSuccess();
            case apiConstants.failure:
                return this.renderFailure();
            case apiConstants.in_progress:
                return this.renderInProgress()
            default:
                return null
        }
    }

    render(){
        const {productName, productPrice, ProductImg,successMsg,errorMsg,status,orderId,statusmsg} = this.state
        return(
            <>
                <Header />
                <div className='add-product-bg-container'>
                    <div className='add-product-subcard-container'>
                        <h1 className='add-product-heading'>Add the product in Catalog <BsArrowDown /></h1>
                        <form className='add-product-form-container' onSubmit={this.onproductSubmit}>
                            <input type="text" className='inputEl' placeholder='Product Name' value={productName} onChange={this.onChangeProductName}/>
                            <input type="text" className='inputEl' placeholder='Product price' value={productPrice} onChange={this.onChangeProductPrice}/>
                            <input type="text" className='inputEl' placeholder='Product Img Url' value={ProductImg} onChange={this.onChangeProductImg}/>
                            <button type='submit' className='add-product-btn'>Add</button>
                        </form>
                        {successMsg.length > 0 && <p className='success-msg'>{successMsg}</p>}
                        {errorMsg.length > 0 && <p className='error-msg'>{errorMsg}</p>}
                    </div>
                    
                    <div className='update-product-subcard-container'>
                        <h1 className='add-product-heading'>Update Status <BsArrowDown /></h1>
                        <form className='add-product-form-container' onSubmit={this.changeStatusOfProduct}>
                            <input type="text" className='inputEl' placeholder='Order Id' value={orderId} onChange={this.onChangeOrderId}/>
                            <select className='select-inputEl' onChange={this.onChangeStatus} value={status}>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                            <button type='submit' className='add-product-btn'>Update</button>
                        </form>
                        {statusmsg.includes('Status') ? <p className='success-msg'>{statusmsg}</p> : <p className='error-msg'>{statusmsg}</p>}
                    </div>

                    <div>
                        <button type="button" className='logout-btn' onClick={this.onLogoutClick}>Log Out admin</button>
                    </div>
                </div>
                <hr className='hr-line' />
                {this.renderSwitchOperation()}
            </>
        )
    }
}

export default withNavigation(AdminDashboard)