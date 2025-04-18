import './index.css'

const OrderItem = (props) => {
    const {itemDetails} = props
    const {orderId, productImgUrl, status, createdAt} = itemDetails
    let colorClass;
    if(status === "Pending"){
        colorClass = "pending"
    }
    else if(status === "In Progress"){
        colorClass = "in-progress"
    }
    else if(status === "Delivered"){
        colorClass = "delivered"
    }
    return (
        <li className='order-item-list'>
            <p className='item-id'>{orderId}</p>
            <img src={productImgUrl} alt={orderId} className='item-img' />
            <p className={`item-status ${colorClass}`}>{status}</p>
            <p className='item-timestamp'>{createdAt}</p>
        </li>
    )
}

export default OrderItem