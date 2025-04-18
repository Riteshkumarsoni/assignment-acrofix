import { Component } from 'react'
import {v4 as uuidv4} from 'uuid'
import Header from '../Header'
import {withNavigation} from '../WithNavigation'
import './index.css'

class OrderProduct extends Component{
    state = {quantity: '', buyerName: '', contactInfo: '', deliveryAddress: '', errorMsg: '',orderId: ''}

    onChangeQuantity = (event) => {
        this.setState({quantity: event.target.value})
    }

    onChangeBuyerName = (event) => {
        this.setState({buyerName: event.target.value})
    }

    onChangeContactInfo = (event) => {
        this.setState({contactInfo: event.target.value})
    }

    onChangeDeliveryAddress = (event) => {
        this.setState({deliveryAddress: event.target.value})
    }

    onSubmitForm = async (event) => {
        event.preventDefault()
        const {params} = this.props
        const {productId} = params
        const orderId = uuidv4()
        const {quantity, buyerName,contactInfo,deliveryAddress} = this.state
        const orderDetails = {order_id: orderId, product_id: productId, quantity: quantity, buyer_name: buyerName, contact_info: contactInfo, delivery_address: deliveryAddress}
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderDetails)
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/order/placed`, options)
        const data = await response.json()
        if(response.ok){
            this.setState({errorMsg: '', orderId: orderId})
        }
        else{
            this.setState({errorMsg: data.msg, successMsg: ''})
        }
    }

    render(){
        const {quantity, buyerName, contactInfo, deliveryAddress,errorMsg,orderId} = this.state
        const {params} = this.props
        const {productId} = params
        return (
            <>
                <Header />
                <div className='order-page-bg-container'>
                    <div className='order-page-card-container'>
                        <p className='order-product-id-title'>Product Id: {productId}</p>
                        <form className='order-page-bg-container' onSubmit={this.onSubmitForm}>
                            <input type="number" className='order-input' placeholder='Quantity' value={quantity} onChange={this.onChangeQuantity} />
                            <input type="text" className='order-input' placeholder='Buyer Name' value={buyerName} onChange={this.onChangeBuyerName} />
                            <input type="text" className='order-input' placeholder='Contact Info' value={contactInfo} onChange={this.onChangeContactInfo} />
                            <textarea
                                className="textareaEl"
                                placeholder="Delivery Address"
                                rows={7}
                                cols={34}
                                value={deliveryAddress}
                                onChange={this.onChangeDeliveryAddress}
                            />
                            <button type='submit' className='order-placed-btn'>Placed Order</button>
                        </form>
                        {orderId.length > 0 && <p className='success-msg'>♥ save this orderId for tracking - {orderId}</p>}
                        {errorMsg.length > 0 && <p className='error-msg'>**{errorMsg}</p>}
                    </div>
                </div>
            </>
        )
    }
}
export default withNavigation(OrderProduct)