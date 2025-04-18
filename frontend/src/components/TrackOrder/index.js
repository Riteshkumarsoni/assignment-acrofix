import {Component} from 'react'
import Header from '../Header'
import './index.css'

class TrackOrder extends Component{
    state = {orderId: '', orderData: [], errorMsg: '', flag: 0}

    onChangeOrderId = (event) => {
        this.setState({orderId: event.target.value})
    }

    onSubmitTrackingDetails = async (event) => {
        event.preventDefault()
        const {orderId} = this.state
        const response = await fetch(`${process.env.REACT_APP_API_URL}/show-order/${orderId}`)
        if(response.ok){
            const fetchedData = await response.json()
            const updatedData = {
                orderId: fetchedData[0].order_id,
                productId: fetchedData[0].product_id,
                quantity: fetchedData[0].quantity,
                buyerName: fetchedData[0].buyer_name,
                contactInfo: fetchedData[0].contact_info,
                deliveryAddress: fetchedData[0].delivery_address,
                status: fetchedData[0].status,
                createdAt: fetchedData[0].created_at
            }
            this.setState({orderData: updatedData, flag: 1})
        }else{
            const data = await response.json()
            this.setState({errorMsg: data.msg, flag: 0})
        }
        
    }

    render(){
        const {orderId, orderData, flag,errorMsg} = this.state
        const {
            productId,
            quantity,
            status,
            deliveryAddress,
            createdAt} = orderData
        return (
            <>
                <Header />
                <div className='tracking-main-container'>
                    <div className="tracking-details-container"> 
                        <h1 className='tracking-order-details'>Track By Order Id</h1>
                        <form className='track-order-form-container' onSubmit={this.onSubmitTrackingDetails}>
                            <input type='text' placeholder='Order Id' className='orderId-input' value={orderId} onChange={this.onChangeOrderId} />
                            <button type="submit" className='track-order-btn'>Track</button>
                        </form>
                        {errorMsg.length > 0 && <p className='error-msg'>**{errorMsg}</p>}
                    </div>
                    <div>
                        {flag === 1 && 
                        <div className='title-value-container'>
                            <div>
                                <p className='title'>Order Id&emsp;</p>
                                <p className='title'>Product Id&emsp;</p>
                                <p className='title'>Quantity&emsp;</p>
                                <p className='title'>status&emsp;</p>
                                <p className='title'>Created At&emsp;</p>
                                <p className='title'>Delivery&emsp;</p>
                            </div>
                            <div>
                                <p className='value'>{orderId}</p>
                                <p className='value'>{productId}</p>
                                <p className='value'>{quantity}</p>
                                <p className='value'>{status}</p>
                                <p className='value'>{createdAt}</p>
                                <p className='value'>{deliveryAddress}</p>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default TrackOrder